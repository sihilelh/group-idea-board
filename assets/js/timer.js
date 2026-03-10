/**
 * Pomodoro Study Timer with Analytics
 * Tracks focus time, sessions, and activity
 */

const Timer = {
    // Timer state
    timeRemaining: 25 * 60,
    durations: {
        pomodoro: 25 * 60,
        'short-break': 5 * 60,
        'long-break': 15 * 60
    },
    currentMode: 'pomodoro',
    isRunning: false,
    isPaused: false,
    timerInterval: null,
    
    // Analytics tracking
    sessionsCompleted: 0,
    totalFocusTime: 0, // in seconds
    sessionStartTime: null,
    sessionPauseTime: 0, // accumulated pause time
    activityLog: [],

    /**
     * Initialize the timer
     */
    init() {
        this.loadData();
        this.updateDisplay();
        this.updateAnalytics();
        this.updateTabButtons(); // Highlight the correct tab on load
    },

    /**
     * Set timer mode (pomodoro, short-break, long-break)
     * @param {string} mode - Timer mode to set
     * @param {Event} evt - Optional click event for tab button highlighting
     */
    setMode(mode, evt) {
        if (this.isRunning) return;

        this.currentMode = mode;
        this.timeRemaining = this.durations[mode];
        this.updateDisplay();
        this.updateTabButtons(evt);
    },

    /**
     * Update active tab button
     * @param {Event} evt - Optional click event to identify the clicked button
     */
    updateTabButtons(evt) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // If event provided, use its target; otherwise find button by mode text
        if (evt && evt.target) {
            evt.target.classList.add('active');
        } else {
            // Fallback: find button by matching text content
            const modeLabels = {
                'pomodoro': 'Pomodoro',
                'short-break': 'Short Break',
                'long-break': 'Long Break'
            };
            const label = modeLabels[this.currentMode];
            if (label) {
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    if (btn.textContent.trim() === label) {
                        btn.classList.add('active');
                    }
                });
            }
        }
    },

    /**
     * Start the timer
     */
    start() {
        if (this.isRunning && !this.isPaused) return;

        this.isRunning = true;
        this.isPaused = false;
        
        if (!this.sessionStartTime) {
            this.sessionStartTime = Date.now();
        }

        this.updateButtonStates();
        this.updateStatus();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;

            if (this.timeRemaining <= 0) {
                this.timerComplete();
            } else {
                this.updateDisplay();
            }
        }, 1000);
    },

    /**
     * Pause the timer
     */
    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.isPaused = true;

        // Track pause time
        if (this.sessionStartTime) {
            this.sessionPauseTime += Date.now() - this.sessionStartTime;
            this.sessionStartTime = null;
        }

        clearInterval(this.timerInterval);
        this.updateButtonStates();
        this.updateStatus();
    },

    /**
     * Reset the timer
     */
    reset() {
        this.isRunning = false;
        this.isPaused = false;

        clearInterval(this.timerInterval);

        // Reset session tracking
        if (this.sessionStartTime) {
            const focusTimeThisSession = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            if (focusTimeThisSession > 60) { // Only log if session was more than 1 minute
                this.addActivityLog('Session paused/reset', focusTimeThisSession);
            }
        }
        this.sessionStartTime = null;
        this.sessionPauseTime = 0;

        this.timeRemaining = this.durations[this.currentMode];
        this.updateDisplay();
        this.updateButtonStates();
        this.updateStatus();
    },

    /**
     * Handle timer completion
     */
    timerComplete() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isPaused = false;

        // Track session completion
        if (this.currentMode === 'pomodoro') {
            this.sessionsCompleted++;
            if (this.sessionStartTime) {
                const focusTime = Math.floor((Date.now() - this.sessionStartTime) / 1000) + this.sessionPauseTime;
                this.totalFocusTime += focusTime;
                this.addActivityLog('Pomodoro session completed', focusTime);
            }
        }

        // Play bell notification
        this.playBellSound();

        // Show completion message
        const message = this.currentMode === 'pomodoro' 
            ? '🎉 Great work! Time for a break.'
            : '✅ Break time is over. Ready to focus?';
        alert(message);

        // Reset session tracking
        this.sessionStartTime = null;
        this.sessionPauseTime = 0;

        // Reset timer
        this.timeRemaining = this.durations[this.currentMode];
        this.updateDisplay();
        this.updateButtonStates();
        this.updateStatus();
        this.updateAnalytics();
        this.saveData();
    },

    /**
     * Update timer display (MM:SS format)
     */
    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');

        // Update page title
        document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - ScholarKit`;
    },

    /**
     * Update button visibility
     */
    updateButtonStates() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        if (this.isRunning) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        } else {
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
        }
    },

    /**
     * Update status message
     */
    updateStatus() {
        const statusElement = document.getElementById('statusText');

        if (this.isRunning) {
            if (this.currentMode === 'pomodoro') {
                statusElement.textContent = '⏱️ Focus time! Keep studying...';
            } else if (this.currentMode === 'short-break') {
                statusElement.textContent = '☕ Short break - Relax!';
            } else {
                statusElement.textContent = '🌟 Long break - Take your time!';
            }
        } else if (this.isPaused) {
            statusElement.textContent = '⏸️ Timer paused';
        } else {
            const modeText = this.currentMode === 'pomodoro' 
                ? 'Ready to focus?' 
                : 'Ready for your break?';
            statusElement.textContent = '📚 ' + modeText;
        }
    },

    /**
     * Update analytics display
     */
    updateAnalytics() {
        // Update focus time
        document.getElementById('totalFocusTime').textContent = this.formatTime(this.totalFocusTime);
        
        // Update sessions count
        document.getElementById('sessionsCount').textContent = this.sessionsCompleted;

        // Display activity log
        this.displayActivityLog();
    },

    /**
     * Format seconds to readable time
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return '<1m';
        }
    },

    /**
     * Add activity log entry
     */
    addActivityLog(activity, duration) {
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        this.activityLog.unshift({
            activity,
            duration,
            time,
            timestamp: Date.now()
        });

        // Keep only last 10 entries
        if (this.activityLog.length > 10) {
            this.activityLog.pop();
        }

        this.displayActivityLog();
        this.saveData();
    },

    /**
     * Display activity log
     */
    displayActivityLog() {
        const activityList = document.getElementById('activityList');

        if (this.activityLog.length === 0) {
            activityList.innerHTML = '<p class="empty-state">No active sessions yet. Start studying!</p>';
            return;
        }

        activityList.innerHTML = this.activityLog.map(entry => `
            <div class="activity-item">
                <strong>${entry.activity}</strong>
                <div class="time">${entry.time} • ${this.formatTime(entry.duration)}</div>
            </div>
        `).join('');
    },

    /**
     * Play bell sound notification
     */
    playBellSound() {
        try {
            // Create bell sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Define bell tones
            const tones = [
                { frequency: 1046.5, duration: 0.3 },  // C6
                { frequency: 1046.5, duration: 0.3 },  // C6
                { frequency: 1318.5, duration: 0.4 },  // E6
            ];

            tones.forEach((tone, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = tone.frequency;
                oscillator.type = 'sine';

                const startTime = audioContext.currentTime + index * 0.15;
                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + tone.duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + tone.duration);
            });
        } catch (e) {
            console.log('Web Audio API not available');
            try {
                const audio = document.getElementById('timerSound');
                if (audio) audio.play();
            } catch (err) {
                console.log('Audio playback not available');
            }
        }
    },

    /**
     * Save data to localStorage
     */
    saveData() {
        const data = {
            sessionsCompleted: this.sessionsCompleted,
            totalFocusTime: this.totalFocusTime,
            activityLog: this.activityLog,
            lastSaved: Date.now()
        };
        localStorage.setItem('timerData', JSON.stringify(data));
    },

    /**
     * Load data from localStorage
     */
    loadData() {
        const saved = localStorage.getItem('timerData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.sessionsCompleted = data.sessionsCompleted || 0;
                this.totalFocusTime = data.totalFocusTime || 0;
                this.activityLog = data.activityLog || [];
            } catch (e) {
                console.log('Error loading saved data');
            }
        }
    }
};

// Initialize timer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Timer.init());
} else {
    Timer.init();
}
