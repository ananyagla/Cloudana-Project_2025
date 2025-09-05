document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userAvatar = document.getElementById('user-avatar');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const dropdownUsername = document.getElementById('dropdown-username');
    const dropdownEmail = document.getElementById('dropdown-email');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Modal elements
    const pictureModal = document.getElementById('picture-modal');
    const settingsModal = document.getElementById('settings-modal');
    const changePictureBtn = document.getElementById('change-picture-btn');
    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    
    // Modal controls
    const closePictureModal = document.getElementById('close-picture-modal');
    const closeSettingsModal = document.getElementById('close-settings-modal');
    
    // Upload elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const previewArea = document.getElementById('preview-area');
    const imagePreview = document.getElementById('image-preview');
    const uploadBtn = document.getElementById('upload-btn');
    const cancelUploadBtn = document.getElementById('cancel-upload-btn');
    
    // Form elements
    const settingsForm = document.getElementById('settings-form');
    const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
    
    // UI elements
    const loadingOverlay = document.getElementById('loading-overlay');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    // Stats elements
    const memberSince = document.getElementById('member-since');
    const lastLogin = document.getElementById('last-login');
    const activityCount = document.getElementById('activity-count');
    const activityList = document.getElementById('activity-list');

    // Default avatar URL
    const defaultAvatarUrl = 'https://www.w3schools.com/howto/img_avatar.png';
    
    // Current user data
    let currentUser = JSON.parse(localStorage.getItem('user')) || {};
    let selectedFile = null;

    // Initialize dashboard
    initializeDashboard();

    // ===== INITIALIZATION =====
    async function initializeDashboard() {
        try {
            // Show loading state
            showLoading(true);
            
            // Check if user is logged in
            if (!currentUser || !currentUser.email) {
                window.location.href = '/';
                return;
            }
            
            // Update UI with current user data
            updateUserInterface();
            
            // Set up event listeners
            setupEventListeners();
            
            // Try to load additional data from server
            await loadUserData();
            
            showLoading(false);
            
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            showToast('Error loading dashboard', 'error');
            showLoading(false);
        }
    }

    async function loadUserData() {
        try {
            // Try to fetch updated user data and stats
            if (currentUser.email) {
                await Promise.allSettled([
                    loadUserProfile(),
                    loadDashboardStats()
                ]);
            }
        } catch (error) {
            console.warn('Could not load server data:', error);
            // Continue with cached data
        }
    }

    async function loadUserProfile() {
        try {
            const response = await fetch(`/api/profile/${currentUser.email}`);
            if (response.ok) {
                const data = await response.json();
                currentUser = { ...currentUser, ...data.user };
                localStorage.setItem('user', JSON.stringify(currentUser));
                updateUserInterface();
            }
        } catch (error) {
            console.warn('Could not load user profile:', error);
        }
    }

    async function loadDashboardStats() {
        try {
            const response = await fetch(`/api/dashboard/stats/${currentUser.email}`);
            if (response.ok) {
                const data = await response.json();
                updateStatsDisplay(data.stats);
            }
        } catch (error) {
            console.warn('Could not load dashboard stats:', error);
        }
    }

    function updateUserInterface() {
        // Update username displays
        const username = currentUser.username || 'User';
        const email = currentUser.email || 'user@example.com';
        const avatarUrl = currentUser.img || defaultAvatarUrl;

        if (usernameDisplay) {
            usernameDisplay.textContent = username;
        }

        if (userAvatar) {
            userAvatar.src = avatarUrl;
        }
        const profileAvatarMain = document.getElementById('profile-avatar-main');
            if (profileAvatarMain) {
            profileAvatarMain.src = avatarUrl;
            }

        if (dropdownAvatar) {
            dropdownAvatar.src = avatarUrl;
        }

        if (dropdownUsername) {
            dropdownUsername.textContent = username;
        }

        if (dropdownEmail) {
            dropdownEmail.textContent = email;
        }
    }

    function updateStatsDisplay(stats = {}) {
        // Update member since
        if (memberSince) {
            const joinDate = stats.userSince ? new Date(stats.userSince) : new Date();
            memberSince.textContent = joinDate.toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            });
        }

        // Update last login
        if (lastLogin) {
            const loginDate = stats.lastLogin ? new Date(stats.lastLogin) : new Date();
            lastLogin.textContent = loginDate.toLocaleDateString('en-US');
        }

        // Update activity count
        if (activityCount) {
            activityCount.textContent = stats.activityCount || '0';
        }
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Avatar click to toggle dropdown
        userAvatar?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu?.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (dropdownMenu && !dropdownMenu.contains(e.target) && e.target !== userAvatar) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Modal event listeners
        changePictureBtn?.addEventListener('click', openPictureModal);
        profileSettingsBtn?.addEventListener('click', openSettingsModal);
        closePictureModal?.addEventListener('click', () => closePictureModalFn());
        closeSettingsModal?.addEventListener('click', () => closeSettingsModalFn());
        
        // Upload event listeners
        uploadArea?.addEventListener('click', () => fileInput?.click());
        uploadArea?.addEventListener('dragover', handleDragOver);
        uploadArea?.addEventListener('drop', handleDrop);
        fileInput?.addEventListener('change', handleFileSelect);
        uploadBtn?.addEventListener('click', handleUpload);
        cancelUploadBtn?.addEventListener('click', cancelUpload);
        
        // Settings form
        settingsForm?.addEventListener('submit', handleSettingsUpdate);
        cancelSettingsBtn?.addEventListener('click', () => closeSettingsModalFn());
        
        // Logout
        logoutBtn?.addEventListener('click', handleLogout);
        
        // Other dropdown items
        document.getElementById('activity-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Activity feature coming soon!');
        });

        // Close modals on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePictureModalFn();
                closeSettingsModalFn();
            }
        });

        // Close modals when clicking backdrop
        pictureModal?.addEventListener('click', (e) => {
            if (e.target === pictureModal) closePictureModalFn();
        });
        
        settingsModal?.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettingsModalFn();
        });
    }

    // ===== MODAL FUNCTIONS =====
    function openPictureModal() {
        if (pictureModal) {
            pictureModal.style.display = 'flex';
            pictureModal.classList.add('show');
            resetUploadState();
        }
        dropdownMenu?.classList.remove('show');
    }

    function closePictureModalFn() {
        if (pictureModal) {
            pictureModal.style.display = 'none';
            pictureModal.classList.remove('show');
            resetUploadState();
        }
    }

    function openSettingsModal() {
        if (settingsModal) {
            // Populate form with current user data
            const usernameInput = document.getElementById('username-input');
            const emailInput = document.getElementById('email-input');
            
            if (usernameInput) usernameInput.value = currentUser.username || '';
            if (emailInput) emailInput.value = currentUser.email || '';
            
            // Clear password fields
            const currentPassword = document.getElementById('current-password');
            const newPassword = document.getElementById('new-password');
            if (currentPassword) currentPassword.value = '';
            if (newPassword) newPassword.value = '';
            
            settingsModal.style.display = 'flex';
            settingsModal.classList.add('show');
        }
        dropdownMenu?.classList.remove('show');
    }

    function closeSettingsModalFn() {
        if (settingsModal) {
            settingsModal.style.display = 'none';
            settingsModal.classList.remove('show');
        }
    }

    // ===== UPLOAD FUNCTIONS =====
    function handleDragOver(e) {
        e.preventDefault();
        uploadArea?.classList.add('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        uploadArea?.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }

    function handleFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB', 'error');
            return;
        }

        selectedFile = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (imagePreview) {
                imagePreview.src = e.target.result;
            }
            if (uploadArea) uploadArea.style.display = 'none';
            if (previewArea) previewArea.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    async function handleUpload() {
        if (!selectedFile) {
            showToast('No file selected', 'error');
            return;
        }

        try {
            showLoading(true);
            
            const formData = new FormData();
            formData.append('profilePicture', selectedFile);
            formData.append('email', currentUser.email);

            const response = await fetch('/api/profile/update-picture', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                // Update user data
                currentUser.img = data.imageUrl;
                localStorage.setItem('user', JSON.stringify(currentUser));
                
                // Update UI
                updateUserInterface();
                
                showToast('Profile picture updated successfully!');
                closePictureModalFn();
                addActivity('Updated profile picture');
                
            } else {
                showToast(data.message || 'Error updating profile picture', 'error');
            }
            
        } catch (error) {
            console.error('Upload error:', error);
            showToast('Error uploading file', 'error');
        } finally {
            showLoading(false);
        }
    }

    function cancelUpload() {
        resetUploadState();
    }

    function resetUploadState() {
        selectedFile = null;
        if (uploadArea) uploadArea.style.display = 'block';
        if (previewArea) previewArea.style.display = 'none';
        if (imagePreview) imagePreview.src = '';
        if (fileInput) fileInput.value = '';
        uploadArea?.classList.remove('dragover');
    }

    // ===== SETTINGS UPDATE =====
    async function handleSettingsUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(settingsForm);
        const updateData = {
            email: currentUser.email,
            username: formData.get('username'),
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword')
        };

        // Validate username
        if (!updateData.username?.trim()) {
            showToast('Username is required', 'error');
            return;
        }

        // Validate password change
        if (updateData.newPassword && !updateData.currentPassword) {
            showToast('Current password required to change password', 'error');
            return;
        }

        try {
            showLoading(true);
            
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            
            if (response.ok) {
                // Update user data
                currentUser = { ...currentUser, ...data.user };
                localStorage.setItem('user', JSON.stringify(currentUser));
                
                // Update UI
                updateUserInterface();
                
                showToast('Profile updated successfully!');
                closeSettingsModalFn();
                addActivity('Updated profile settings');
                
            } else {
                showToast(data.message || 'Error updating profile', 'error');
            }
            
        } catch (error) {
            console.error('Settings update error:', error);
            showToast('Error updating profile', 'error');
        } finally {
            showLoading(false);
        }
    }

    // ===== UTILITY FUNCTIONS =====
    function handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        showToast('Logged out successfully!');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }

    function showLoading(show) {
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    function showToast(message, type = 'success') {
        if (!toast || !toastMessage) return;
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    function addActivity(text) {
        if (!activityList) return;
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="activity-content">
                <p><strong>${text}</strong></p>
                <span class="activity-time">Just now</span>
            </div>
        `;
        
        // Add to top of list
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Keep only 5 most recent activities
        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }

    console.log('Dashboard initialized successfully');
});
