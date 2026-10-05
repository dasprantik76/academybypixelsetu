/**
 * PixelSetu Cloud - Super Admin Control Plane
 * Dedicated Platform Management Client Script
 */

(function () {
  'use strict';

  const SESSION_KEY = 'educore_admin_session';
  const SUPER_ADMIN_EMAIL = 'dasprantik76@gmail.com';

  // State
  let currentSession = null;
  let allTenants = [];
  let allStudents = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let studentSearchQuery = '';
  let selectedStudentAcademy = 'all';

  // 1. Session Verification
  function verifySuperAdminSession() {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      window.location.replace('index.html');
      return null;
    }

    try {
      const session = JSON.parse(rawSession);
      const email = String(session.email || '').toLowerCase().trim();
      
      if (!email) {
        localStorage.removeItem(SESSION_KEY);
        window.location.replace('index.html');
        return null;
      }

      // Check superadmin permissions
      const isSuper = email === SUPER_ADMIN_EMAIL || Boolean(session.isSuperAdmin);
      if (!isSuper) {
        alert('Access Denied: Super Admin privileges required to view this interface.');
        window.location.replace('admin.html');
        return null;
      }

      return session;
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
      window.location.replace('index.html');
      return null;
    }
  }

  // 2. Toast Notifications
  function showToast(message, icon = 'fa-circle-check', isError = false) {
    const toast = document.getElementById('saToast');
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${isError ? '#ef4444' : '#10b981'};"></i><span>${message}</span>`;
    toast.style.display = 'flex';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  }

  // 3. Tab Routing
  function initTabNavigation() {
    const tabs = document.querySelectorAll('.sa-tab');
    const panes = {
      overview: document.getElementById('viewOverview'),
      tenants: document.getElementById('viewTenants'),
      students: document.getElementById('viewStudents'),
      infrastructure: document.getElementById('viewInfrastructure')
    };

    function activateTab(viewName) {
      tabs.forEach(tab => {
        if (tab.dataset.view === viewName) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      Object.entries(panes).forEach(([name, pane]) => {
        if (pane) {
          pane.style.display = (name === viewName) ? 'block' : 'none';
        }
      });

      window.history.replaceState(null, '', `#${viewName}`);
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activateTab(tab.dataset.view);
      });
    });

    document.getElementById('btnJumpToPending')?.addEventListener('click', () => {
      activateTab('tenants');
      setTenantFilter('pending');
    });

    document.getElementById('btnViewAllTenantsLink')?.addEventListener('click', () => {
      activateTab('tenants');
      setTenantFilter('all');
    });

    // Hash check on load
    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (hash && panes[hash]) {
      activateTab(hash);
    }
  }

  // 4. API Operations
  async function callApi(action, payload = {}) {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        payload: {
          ownerEmail: currentSession?.email || SUPER_ADMIN_EMAIL,
          ...payload
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  }

  async function loadPlatformData() {
    const refreshBtn = document.getElementById('btnGlobalRefresh');
    if (refreshBtn) refreshBtn.querySelector('i')?.classList.add('fa-spin');

    try {
      const [tenantsRes, studentsRes] = await Promise.all([
        callApi('get_all_tenants'),
        callApi('get_all_platform_students', { limit: 1000 }).catch(() => ({ success: true, students: [] }))
      ]);

      if (tenantsRes.success) {
        allTenants = (tenantsRes.tenants || []).filter(t => t.ownerEmail !== SUPER_ADMIN_EMAIL && !t.isSuperAdmin);
      }
      if (studentsRes.success) {
        allStudents = (studentsRes.students || []).filter(s => s.ownerEmail !== SUPER_ADMIN_EMAIL);
      }

      renderAll();
      showToast('Platform data updated', 'fa-rotate');
    } catch (err) {
      console.error('[SuperAdmin Load Error]:', err);
      showToast(err.message || 'Failed to fetch platform data', 'fa-triangle-exclamation', true);
    } finally {
      if (refreshBtn) refreshBtn.querySelector('i')?.classList.remove('fa-spin');
    }
  }

  // 5. Render Functions
  function renderAll() {
    renderKPIs();
    renderOverviewPanels();
    renderTenantsTable();
    renderStudentsTable();
    populateJumpSelect();
  }

  function renderKPIs() {
    const totalTenants = allTenants.length;
    const activeTenants = allTenants.filter(t => t.status === 'active').length;
    const pendingTenants = allTenants.filter(t => t.status === 'pending').length;

    const totalStudents = allTenants.reduce((acc, t) => acc + (t.studentCount || 0), 0) || allStudents.length;
    const totalCourses = allTenants.reduce((acc, t) => acc + (t.courseCount || 0), 0);
    const totalCertificates = allTenants.reduce((acc, t) => acc + (t.certCount || 0), 0);

    // KPI Numbers
    document.getElementById('kpiTotalTenants').textContent = totalTenants;
    document.getElementById('kpiActiveTenantsBadge').textContent = `${activeTenants} Active`;
    document.getElementById('kpiPendingTenantsBadge').textContent = `${pendingTenants} Pending`;
    document.getElementById('kpiTotalStudents').textContent = totalStudents.toLocaleString();
    document.getElementById('kpiTotalCourses').textContent = totalCourses.toLocaleString();
    document.getElementById('kpiTotalCertificates').textContent = totalCertificates.toLocaleString();

    // Pending Banner
    const pendingBanner = document.getElementById('saPendingBanner');
    const navPendingBadge = document.getElementById('navPendingBadge');
    const filterPendingBadge = document.getElementById('filterPendingBadge');

    if (filterPendingBadge) filterPendingBadge.textContent = pendingTenants;

    if (pendingTenants > 0) {
      if (pendingBanner) {
        pendingBanner.style.display = 'flex';
        document.getElementById('saPendingBannerText').textContent = 
          `${pendingTenants} academy registration request${pendingTenants > 1 ? 's' : ''} waiting for approval and subdomain activation.`;
      }
      if (navPendingBadge) {
        navPendingBadge.textContent = pendingTenants;
        navPendingBadge.style.display = 'inline-flex';
      }
    } else {
      if (pendingBanner) pendingBanner.style.display = 'none';
      if (navPendingBadge) navPendingBadge.style.display = 'none';
    }
  }

  function renderOverviewPanels() {
    const container = document.getElementById('overviewTenantsList');
    if (!container) return;

    if (allTenants.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.8125rem;">No academies provisioned yet.</div>';
      return;
    }

    const displayTenants = allTenants.slice(0, 5);
    container.innerHTML = displayTenants.map(t => {
      const isSuper = t.ownerEmail === SUPER_ADMIN_EMAIL;
      const statusColor = t.status === 'active' ? '#10b981' : (t.status === 'pending' ? '#f59e0b' : '#ef4444');
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>${escapeHtml(t.academyName || 'Unnamed Academy')}</span>
              ${isSuper ? '<span class="badge" style="background: rgba(99,102,241,0.2); color: #818cf8; font-size: 0.65rem;">Platform Master</span>' : ''}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
              <span class="subdomain-badge">${escapeHtml(t.slug || 'slug')}.pixelsetu.com</span>
              <span style="margin-left: 0.5rem;">${t.studentCount || 0} Students enrolled</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};" title="${t.status}"></span>
            <a href="admin.html?impersonate=${encodeURIComponent(t.ownerEmail)}" class="btn-sa btn-sa-secondary btn-sa-sm" title="Inspect Academy">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Inspect
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTenantsTable() {
    const tbody = document.getElementById('saTenantsTableBody');
    if (!tbody) return;

    let filtered = allTenants;

    if (currentFilter !== 'all') {
      filtered = filtered.filter(t => (t.status || 'pending') === currentFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(t => 
        (t.academyName || '').toLowerCase().includes(q) ||
        (t.ownerName || '').toLowerCase().includes(q) ||
        (t.ownerEmail || '').toLowerCase().includes(q) ||
        (t.slug || '').toLowerCase().includes(q) ||
        (t.phone || '').includes(q)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="sa-empty-state">
            <div class="sa-empty-icon"><i class="fa-solid fa-school-circle-xmark"></i></div>
            <h4 style="color: #fff; margin-bottom: 0.25rem;">No Academies Found</h4>
            <p style="font-size: 0.8125rem;">No registered academies match your current search or filter.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const isSuper = t.ownerEmail === SUPER_ADMIN_EMAIL;
      const statusClass = t.status === 'active' ? 'badge-active' : (t.status === 'pending' ? 'badge-pending' : 'badge-suspended');
      const publicUrl = `/a/${encodeURIComponent(t.slug || '')}`;
      const impersonateUrl = `admin.html?impersonate=${encodeURIComponent(t.ownerEmail)}`;

      return `
        <tr>
          <td>
            <div class="tenant-cell-name">
              <span>${escapeHtml(t.academyName || 'Unnamed Academy')}</span>
              ${isSuper ? '<span class="badge" style="background: rgba(99,102,241,0.2); color: #818cf8; font-size: 0.65rem;">Platform Master</span>' : ''}
            </div>
            <div class="tenant-cell-sub">
              ${escapeHtml(t.category || 'General Academy')}
            </div>
            <div style="margin-top: 0.4rem;">
              <a href="${publicUrl}" target="_blank" class="subdomain-badge" title="Visit Public Site">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> /a/${escapeHtml(t.slug || 'slug')}
              </a>
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: #fff;">${escapeHtml(t.ownerName || 'Director')}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(t.ownerEmail || '')}</div>
            ${t.phone ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;"><i class="fa-solid fa-phone" style="font-size: 0.65rem;"></i> ${escapeHtml(t.phone)}</div>` : ''}
          </td>
          <td>
            <div style="font-weight: 700; color: #fff; font-size: 0.875rem;">${t.studentCount || 0} Students</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${t.courseCount || 0} Courses • ${t.certCount || 0} Certs</div>
          </td>
          <td>
            <span class="badge ${statusClass}">
              <i class="fa-solid ${t.status === 'active' ? 'fa-circle-check' : (t.status === 'pending' ? 'fa-clock' : 'fa-ban')}"></i>
              ${(t.status || 'pending').toUpperCase()}
            </span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; justify-content: flex-end;">
              ${t.status === 'pending' ? `
                <button type="button" class="btn-sa btn-sa-success btn-sa-sm btn-action-approve" data-email="${escapeHtml(t.ownerEmail)}" title="Approve & Activate Academy Access">
                  <i class="fa-solid fa-check"></i> Approve
                </button>
              ` : ''}

              ${t.status === 'active' && !isSuper ? `
                <button type="button" class="btn-sa btn-sa-danger btn-sa-sm btn-action-suspend" data-email="${escapeHtml(t.ownerEmail)}" title="Suspend Tenant Access">
                  <i class="fa-solid fa-ban"></i> Suspend
                </button>
              ` : ''}

              ${t.status === 'suspended' ? `
                <button type="button" class="btn-sa btn-sa-success btn-sa-sm btn-action-activate" data-email="${escapeHtml(t.ownerEmail)}" title="Re-activate Access">
                  <i class="fa-solid fa-rotate-left"></i> Activate
                </button>
              ` : ''}

              <a href="${impersonateUrl}" class="btn-sa btn-sa-primary btn-sa-sm" title="Launch Portal as this Academy Owner">
                <i class="fa-solid fa-desktop"></i> Launch Portal
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach actions
    tbody.querySelectorAll('.btn-action-approve').forEach(btn => {
      btn.addEventListener('click', () => changeTenantStatus(btn.dataset.email, 'active'));
    });
    tbody.querySelectorAll('.btn-action-suspend').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm(`Suspend access for academy tenant (${btn.dataset.email})?`)) {
          changeTenantStatus(btn.dataset.email, 'suspended');
        }
      });
    });
    tbody.querySelectorAll('.btn-action-activate').forEach(btn => {
      btn.addEventListener('click', () => changeTenantStatus(btn.dataset.email, 'active'));
    });
  }

  function renderStudentsTable() {
    const tbody = document.getElementById('saStudentsTableBody');
    if (!tbody) return;

    let filtered = allStudents;

    if (selectedStudentAcademy !== 'all') {
      filtered = filtered.filter(s => s.ownerEmail === selectedStudentAcademy);
    }

    if (studentSearchQuery) {
      const q = studentSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.enrollmentId || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.course || '').toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="sa-empty-state">
            <div class="sa-empty-icon"><i class="fa-solid fa-user-slash"></i></div>
            <h4 style="color: #fff; margin-bottom: 0.25rem;">No Students Found</h4>
            <p style="font-size: 0.8125rem;">No records matched your search parameters.</p>
          </td>
        </tr>
      `;
      return;
    }

    const tenantMap = Object.fromEntries(allTenants.map(t => [t.ownerEmail, t.academyName]));

    tbody.innerHTML = filtered.slice(0, 100).map(s => {
      const academyName = tenantMap[s.ownerEmail] || s.ownerEmail || 'General';
      const hasCert = Boolean(s.issueCertificate || s.certificateNumber);
      return `
        <tr>
          <td>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--primary-light);">${escapeHtml(s.enrollmentId || 'N/A')}</span>
          </td>
          <td>
            <div style="font-weight: 600; color: #fff;">${escapeHtml(s.name || 'Unnamed')}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(s.phone || '')} ${s.email ? '• ' + escapeHtml(s.email) : ''}</div>
          </td>
          <td>
            <span class="subdomain-badge">${escapeHtml(academyName)}</span>
          </td>
          <td>
            <span style="font-weight: 500; color: var(--text-secondary);">${escapeHtml(s.course || 'Unassigned')}</span>
          </td>
          <td>
            <span style="font-size: 0.8125rem; color: var(--text-muted);">${escapeHtml(s.joinDate || s.createdAt?.slice(0, 10) || 'Recent')}</span>
          </td>
          <td>
            ${hasCert ? `
              <span class="badge badge-active" style="font-size: 0.7rem;"><i class="fa-solid fa-award"></i> Certificate Issued</span>
            ` : `
              <span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); font-size: 0.7rem;">Enrolled</span>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  function populateJumpSelect() {
    const jumpSelect = document.getElementById('quickTenantJumpSelect');
    const academyFilter = document.getElementById('studentAcademyFilter');

    if (jumpSelect) {
      jumpSelect.innerHTML = '<option value="">⚡ Inspect Academy Portal...</option>' + 
        allTenants.map(t => `
          <option value="${escapeHtml(t.ownerEmail)}">${escapeHtml(t.academyName)} (${escapeHtml(t.slug || 'slug')})</option>
        `).join('');
    }

    if (academyFilter) {
      academyFilter.innerHTML = '<option value="all">All Academies</option>' +
        allTenants.map(t => `
          <option value="${escapeHtml(t.ownerEmail)}">${escapeHtml(t.academyName)}</option>
        `).join('');
    }
  }

  // 6. Tenant Status Mutation
  async function changeTenantStatus(targetOwnerEmail, newStatus) {
    try {
      showToast(`Updating status to ${newStatus}...`, 'fa-spinner fa-spin');
      const res = await callApi('update_tenant_status', { targetOwnerEmail, status: newStatus });
      if (res.success) {
        showToast(`Tenant access updated to ${newStatus.toUpperCase()}`, 'fa-check');
        await loadPlatformData();
      }
    } catch (err) {
      console.error('[Update Status Error]:', err);
      showToast(err.message || 'Status update failed', 'fa-triangle-exclamation', true);
    }
  }

  function setTenantFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.sa-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTenantsTable();
  }

  // 7. Modals & Forms
  function initModals() {
    const provisionModal = document.getElementById('provisionModal');
    const btnOpen = document.getElementById('btnOpenProvisionModal');
    const btnClose = document.getElementById('btnCloseProvisionModal');
    const btnCancel = document.getElementById('btnCancelProvision');
    const form = document.getElementById('provisionAcademyForm');

    function openModal() {
      if (provisionModal) {
        form.reset();
        provisionModal.style.display = 'flex';
      }
    }

    function closeModal() {
      if (provisionModal) provisionModal.style.display = 'none';
    }

    btnOpen?.addEventListener('click', openModal);
    btnClose?.addEventListener('click', closeModal);
    btnCancel?.addEventListener('click', closeModal);

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const academyName = document.getElementById('newAcademyName').value.trim();
      const ownerName = document.getElementById('newOwnerName').value.trim();
      const targetOwnerEmail = document.getElementById('newOwnerEmail').value.trim();
      const slug = document.getElementById('newSlug').value.trim();
      const category = document.getElementById('newCategory').value.trim();
      const phone = document.getElementById('newPhone').value.trim();

      try {
        showToast('Provisioning academy...', 'fa-spinner fa-spin');
        const res = await callApi('superadmin_create_tenant', {
          academyName,
          ownerName,
          targetOwnerEmail,
          slug,
          category,
          phone
        });

        if (res.success) {
          showToast(`Academy "${academyName}" provisioned successfully!`, 'fa-circle-check');
          closeModal();
          await loadPlatformData();
        }
      } catch (err) {
        console.error('[Provision Error]:', err);
        showToast(err.message || 'Failed to provision academy', 'fa-triangle-exclamation', true);
      }
    });
  }

  // 8. Infrastructure Health Ping
  function initInfrastructure() {
    const pingBtn = document.getElementById('btnTestApiPing');
    const pingText = document.getElementById('infraApiPing');

    async function testPing() {
      if (!pingText) return;
      pingText.textContent = 'Pinging /api/data...';
      const t0 = performance.now();
      try {
        const res = await fetch('/api/data?admin=1&ownerEmail=' + encodeURIComponent(SUPER_ADMIN_EMAIL));
        const t1 = performance.now();
        const latency = Math.round(t1 - t0);
        if (res.ok) {
          pingText.textContent = `Live Response: ${latency} ms latency (200 OK)`;
          pingText.style.color = '#10b981';
        } else {
          pingText.textContent = `Response status: ${res.status}`;
          pingText.style.color = '#f59e0b';
        }
      } catch (err) {
        pingText.textContent = `Ping failed: ${err.message}`;
        pingText.style.color = '#ef4444';
      }
    }

    pingBtn?.addEventListener('click', testPing);
    testPing();
  }

  // Helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    currentSession = verifySuperAdminSession();
    if (!currentSession) return;

    // Set user metadata in header
    const avatarEl = document.getElementById('saUserAvatar');
    const nameEl = document.getElementById('saUserName');
    if (nameEl) nameEl.textContent = currentSession.name || 'Prantik Das';
    if (avatarEl) avatarEl.textContent = (currentSession.name || 'P').charAt(0).toUpperCase();

    // Sign out
    document.getElementById('btnSaLogout')?.addEventListener('click', () => {
      localStorage.removeItem(SESSION_KEY);
      window.location.replace('index.html');
    });

    // Global refresh
    document.getElementById('btnGlobalRefresh')?.addEventListener('click', loadPlatformData);

    // Launch selected tenant
    document.getElementById('btnLaunchSelectedTenant')?.addEventListener('click', () => {
      const select = document.getElementById('quickTenantJumpSelect');
      const val = select?.value;
      if (val) {
        window.location.href = `admin.html?impersonate=${encodeURIComponent(val)}`;
      } else {
        showToast('Please choose an academy first', 'fa-circle-info');
      }
    });

    // Filter and search listeners
    document.querySelectorAll('.sa-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => setTenantFilter(btn.dataset.filter));
    });

    document.getElementById('tenantSearchInput')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTenantsTable();
    });

    document.getElementById('studentSearchInput')?.addEventListener('input', (e) => {
      studentSearchQuery = e.target.value;
      renderStudentsTable();
    });

    document.getElementById('studentAcademyFilter')?.addEventListener('change', (e) => {
      selectedStudentAcademy = e.target.value;
      renderStudentsTable();
    });

    initTabNavigation();
    initModals();
    initInfrastructure();
    loadPlatformData();
  });

})();
