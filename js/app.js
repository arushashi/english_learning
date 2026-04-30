// Simplified Kannada English App - No Authentication Required
class KannadaEnglishApp {
    constructor() {
        this.currentLevel = 0;
        this.progress = this.loadProgress();
        this.currentLevelData = null; // Store current level data
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupLevelSystem();
        this.setupSpeakingPractice();
        this.setupAudioSystem();
        this.updateProgressPage();
        this.updateLevelCards();
    }

    // Navigation System
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        // Mobile menu toggle
        const navMenuToggle = document.getElementById('navMenuToggle');
        const navMenu = document.getElementById('navMenu');
        if (navMenuToggle && navMenu) {
            navMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = navMenuToggle.querySelector('i');
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }

        // Breadcrumb navigation
        const breadcrumbLink = document.querySelector('.breadcrumb-link');
        if (breadcrumbLink) {
            breadcrumbLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('home');
            });
        }

        // Start Learning button
        document.getElementById('startLearning')?.addEventListener('click', () => {
            this.navigateTo('levels');
        });

        // View Levels button
        document.getElementById('viewLevels')?.addEventListener('click', () => {
            this.navigateTo('levels');
        });
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Remove active class from nav links
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        // Show selected page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Set active nav link
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update breadcrumbs
        this.updateBreadcrumbs(page);

        // Close mobile menu
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
            const icon = document.querySelector('.nav-menu-toggle i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }

        // Update page-specific content
        if (page === 'levels') {
            // Restore original levels page content if it was replaced
            this.restoreLevelsPage();
            this.updateLevelCards();
        } else if (page === 'progress') {
            this.updateProgressPage();
        }
    }

    updateBreadcrumbs(page) {
        const breadcrumbs = document.getElementById('breadcrumbs');
        const currentPage = document.getElementById('currentPage');
        
        if (page === 'home') {
            breadcrumbs.style.display = 'none';
        } else {
            breadcrumbs.style.display = 'block';
            const pageNames = {
                'levels': 'Levels',
                'practice': 'Practice',
                'progress': 'My Progress'
            };
            if (currentPage) {
                currentPage.textContent = pageNames[page] || page;
            }
        }
    }

    // Restore original levels page content
    restoreLevelsPage() {
        const levelsPage = document.getElementById('levels');
        if (!levelsPage) return;

        const levelNames = [
            'Absolute Foundation',
            'Survival English',
            'Core Grammar Foundation',
            'Daily Life English',
            'Past and Future Foundation',
            'Real World Situations',
            'Descriptive English',
            'Workplace & Professional',
            'Advanced Grammar',
            'Fluency & Mastery'
        ];

        const levelDescriptions = [
            'Learn English letters, sounds, and basic reading',
            'Greetings, self-introduction, basic needs',
            'Present tense, questions, daily routines',
            'Present continuous, home, family',
            'Basic past, future, time expressions',
            'Shopping, travel, phone, food',
            'People, places, opinions, stories',
            'Office, emails, interviews',
            'Passive voice, conditionals, perfect tenses',
            'Advanced speaking, presentations'
        ];

        const lessonCounts = [11, 12, 15, 12, 10, 15, 12, 12, 15, 10];

        let levelsGridHTML = '';
        for (let i = 0; i < 10; i++) {
            const progress = this.getLevelProgress(i);
            levelsGridHTML += `
                <div class="level-card" data-level="${i}">
                    <div class="level-header">
                        <span class="level-number">${i}</span>
                        <span class="level-status unlocked">${i === 0 ? 'Start Here' : 'Available'}</span>
                    </div>
                    <h3>${levelNames[i]}</h3>
                    <p>${levelDescriptions[i]}</p>
                    <div class="level-details">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>7 days</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-book"></i>
                            <span>${lessonCounts[i]} lessons</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-microphone"></i>
                            <span>Speaking focus</span>
                        </div>
                    </div>
                    <div class="level-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${progress}% complete</span>
                    </div>
                    <button class="btn-level">Start Level</button>
                </div>
            `;
        }

        levelsPage.innerHTML = `
            <div class="container">
                <h2>Learning Levels</h2>
                <p class="section-description">Choose any level to start learning. Each level builds on the previous one.</p>
                <div class="levels-grid" id="levelsGrid">
                    ${levelsGridHTML}
                </div>
            </div>
        `;

        // Re-setup level card event listeners
        this.setupLevelSystem();
    }

    // Level System
    setupLevelSystem() {
        const levelCards = document.querySelectorAll('.level-card');
        
        levelCards.forEach(card => {
            const level = parseInt(card.dataset.level);
            const button = card.querySelector('.btn-level');
            
            button.addEventListener('click', () => {
                this.openLevel(level);
            });
        });
    }

    openLevel(level) {
        // Create or update progress for this level
        if (!this.progress[level]) {
            this.progress[level] = {
                started: false,
                completed: false,
                lessonsCompleted: 0,
                totalLessons: this.getLessonsCount(level),
                quizScore: 0,
                speakingMinutes: 0
            };
        }

        this.progress[level].started = true;
        this.saveProgress();
        
        // Navigate to level content
        this.showLevelContent(level);
    }

    getLessonsCount(level) {
        const lessonsCount = {
            0: 10,
            1: 12,
            2: 15,
            3: 12,
            4: 10,
            5: 15,
            6: 12,
            7: 12,
            8: 15,
            9: 10
        };
        return lessonsCount[level] || 10;
    }

    showLevelContent(level) {
        // Load level content from JSON
        this.loadLevelContentFromJSON(level);
    }

    async loadLevelContentFromJSON(level) {
        try {
            const response = await fetch('data/courseContent.json');
            const data = await response.json();
            const levelKey = `level${level}`;
            
            if (data[levelKey]) {
                const levelData = data[levelKey];
                this.currentLevelData = levelData; // Store level data in class instance
                const levelContent = this.createLevelContentHTML(level, levelData);
                
                // Replace the levels page content with level content
                const levelsPage = document.getElementById('levels');
                levelsPage.innerHTML = levelContent;
                
                // Setup level-specific functionality
                this.setupLevelContent(level, levelData);
            } else {
                // If no content in JSON, show placeholder
                this.showPlaceholderLevelContent(level);
            }
        } catch (error) {
            console.error('Error loading level content:', error);
            this.showPlaceholderLevelContent(level);
        }
    }

    showPlaceholderLevelContent(level) {
        const levelNames = [
            'Absolute Foundation',
            'Survival English',
            'Core Grammar Foundation',
            'Daily Life English',
            'Past and Future Foundation',
            'Real World Situations',
            'Descriptive English',
            'Workplace & Professional',
            'Advanced Grammar',
            'Fluency & Mastery'
        ];

        const levelDescriptions = [
            'Learn English letters, sounds, and basic reading',
            'Greetings, self-introduction, basic needs',
            'Present tense, questions, daily routines',
            'Present continuous, home, family',
            'Basic past, future, time expressions',
            'Shopping, travel, phone, food',
            'People, places, opinions, stories',
            'Office, emails, interviews',
            'Passive voice, conditionals, perfect tenses',
            'Advanced speaking, presentations'
        ];

        const levelContent = `
            <div class="container">
                <button class="btn-back" onclick="app.navigateTo('levels')">
                    <i class="fas fa-arrow-left"></i> Back to Levels
                </button>
                <h2>Level ${level}: ${levelNames[level]}</h2>
                <p class="level-description">${levelDescriptions[level]}</p>
                
                <div class="level-content-container">
                    <div class="level-sidebar">
                        <h3>Lessons</h3>
                        <div class="lessons-list" id="lessonsList">
                            ${this.generateLessonsList(level)}
                        </div>
                        
                        <h3>Level Progress</h3>
                        <div class="level-progress-display">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.getLevelProgress(level)}%"></div>
                            </div>
                            <span class="progress-text">${this.getLevelProgress(level)}% complete</span>
                        </div>
                    </div>
                    
                    <div class="level-main">
                        <div class="lesson-content" id="lessonContent">
                            <div class="lesson-placeholder">
                                <i class="fas fa-book-open"></i>
                                <h3>Select a lesson to begin</h3>
                                <p>Choose a lesson from the sidebar to start learning</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="level-actions">
                    <button class="btn-primary" onclick="app.openQuiz(${level})">
                        <i class="fas fa-question-circle"></i> Take Level Quiz
                    </button>
                    <button class="btn-secondary" onclick="app.navigateTo('practice')">
                        <i class="fas fa-microphone"></i> Practice Speaking
                    </button>
                </div>
            </div>
        `;

        const levelsPage = document.getElementById('levels');
        levelsPage.innerHTML = levelContent;
        
        this.setupLevelContent(level);
    }

    createLevelContentHTML(level, levelData) {
        let lessonsHTML = '';
        if (levelData.lessons && levelData.lessons.length > 0) {
            levelData.lessons.forEach((lesson, index) => {
                const isCompleted = this.progress[level]?.lessonsCompleted > index;
                lessonsHTML += `
                    <div class="lesson-item ${isCompleted ? 'completed' : ''}" data-lesson="${index + 1}">
                        <span class="lesson-number">${index + 1}</span>
                        <span class="lesson-title">${lesson.title}</span>
                        ${isCompleted ? '<i class="fas fa-check-circle completed-icon"></i>' : ''}
                    </div>
                `;
            });
        }

        return `
            <div class="container">
                <button class="btn-back" onclick="app.navigateTo('levels')">
                    <i class="fas fa-arrow-left"></i> Back to Levels
                </button>
                <h2>Level ${level}: ${levelData.title}</h2>
                <p class="level-description">${levelData.description}</p>
                
                <div class="level-info">
                    <p><strong>Prerequisites:</strong> ${levelData.prerequisites}</p>
                </div>
                
                <div class="level-content-container">
                    <div class="level-sidebar">
                        <h3>Lessons</h3>
                        <div class="lessons-list" id="lessonsList">
                            ${lessonsHTML || this.generateLessonsList(level)}
                        </div>
                        
                        <h3>Level Progress</h3>
                        <div class="level-progress-display">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.getLevelProgress(level)}%"></div>
                            </div>
                            <span class="progress-text">${this.getLevelProgress(level)}% complete</span>
                        </div>
                    </div>
                    
                    <div class="level-main">
                        <div class="lesson-content" id="lessonContent">
                            <div class="lesson-placeholder">
                                <i class="fas fa-book-open"></i>
                                <h3>Select a lesson to begin</h3>
                                <p>Choose a lesson from the sidebar to start learning</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="level-actions">
                    <button class="btn-primary" onclick="app.openQuiz(${level})">
                        <i class="fas fa-question-circle"></i> Take Level Quiz
                    </button>
                    <button class="btn-secondary" onclick="app.navigateTo('practice')">
                        <i class="fas fa-microphone"></i> Practice Speaking
                    </button>
                </div>
            </div>
        `;
    }

    setupLevelContent(level, levelData = null) {
        // Use stored levelData if not provided
        const dataToUse = levelData || this.currentLevelData;
        
        const lessonItems = document.querySelectorAll('.lesson-item');
        
        lessonItems.forEach(item => {
            item.addEventListener('click', () => {
                const lesson = parseInt(item.dataset.lesson);
                if (dataToUse && dataToUse.lessons && dataToUse.lessons[lesson - 1]) {
                    this.showLessonFromJSON(level, lesson, dataToUse.lessons[lesson - 1]);
                } else {
                    this.showLesson(level, lesson);
                }
            });
        });
    }

    showLessonFromJSON(level, lesson, lessonData) {
        let speakingPracticeHTML = '';
        if (lessonData.speakingPractice && lessonData.speakingPractice.length > 0) {
            speakingPracticeHTML = lessonData.speakingPractice.map(item => `
                <div class="sentence-item">
                    <span class="sentence">${item.english}</span>
                    <span class="kannada">${item.kannada}</span>
                    <button class="btn-audio-mini" onclick="app.speakText('${item.english.replace(/'/g, "\\'")}')">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            `).join('');
        }

        let additionalContent = '';
        
        // Add vocabulary if present
        if (lessonData.content.vocabulary) {
            const vocabHTML = lessonData.content.vocabulary.map(item => `
                <div class="vocab-item">
                    <span class="vocab-english">${item.english}</span>
                    <span class="vocab-kannada">${item.kannada}</span>
                </div>
            `).join('');
            additionalContent += `
                <div class="lesson-section">
                    <h4>📖 Vocabulary</h4>
                    <div class="vocabulary-list">
                        ${vocabHTML}
                    </div>
                </div>
            `;
        }

        // Add patterns if present
        if (lessonData.content.patterns) {
            const patternsHTML = lessonData.content.patterns.map(item => `
                <div class="pattern-item">
                    <strong>${item.pattern}</strong> = ${item.kannada}
                    <div class="pattern-examples">
                        ${item.examples.map(ex => `<div>${ex}</div>`).join('')}
                    </div>
                </div>
            `).join('');
            additionalContent += `
                <div class="lesson-section">
                    <h4>📝 Sentence Patterns</h4>
                    <div class="patterns-list">
                        ${patternsHTML}
                    </div>
                </div>
            `;
        }

        const lessonContent = `
            <div class="lesson-detail">
                <h3>${lessonData.title}</h3>
                <p class="kannada-title">${lessonData.kannadaTitle || ''}</p>
                
                <div class="lesson-section">
                    <h4>🎯 Learning Objectives</h4>
                    <ul>
                        ${lessonData.content.objectives ? lessonData.content.objectives.map(obj => `<li>${obj}</li>`).join('') : '<li>Understand the key concepts of this lesson</li><li>Practice speaking with the given sentences</li><li>Complete the practice exercises</li>'}
                    </ul>
                </div>
                
                <div class="lesson-section">
                    <h4>📚 Explanation</h4>
                    <div class="content-block">
                        <p>${lessonData.content.explanation}</p>
                        <p class="kannada-explanation">${lessonData.content.kannadaExplanation || ''}</p>
                    </div>
                </div>
                
                ${additionalContent}
                
                <div class="lesson-section">
                    <h4>🗣️ Speaking Practice</h4>
                    <div class="speaking-practice-block">
                        ${speakingPracticeHTML || `
                        <div class="sentence-item">
                            <span class="sentence">Hello, how are you?</span>
                            <span class="kannada">ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?</span>
                            <button class="btn-audio-mini" onclick="app.speakText('Hello, how are you?')">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        `}
                    </div>
                </div>
                
                <div class="lesson-actions">
                    <button class="btn-complete-lesson" onclick="app.completeLesson(${level}, ${lesson})">
                        <i class="fas fa-check"></i> Mark as Complete
                    </button>
                    <button class="btn-next-lesson" onclick="app.nextLesson(${level}, ${lesson})">
                        Next Lesson <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        document.getElementById('lessonContent').innerHTML = lessonContent;
        
        // Mark lesson as active
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.lesson) === lesson) {
                item.classList.add('active');
            }
        });
    }

    showLesson(level, lesson) {
        const lessonContent = `
            <div class="lesson-detail">
                <h3>Lesson ${lesson}</h3>
                
                <div class="lesson-section">
                    <h4>🎯 Learning Objectives</h4>
                    <ul>
                        <li>Understand the key concepts of this lesson</li>
                        <li>Practice speaking with the given sentences</li>
                        <li>Complete the practice exercises</li>
                    </ul>
                </div>
                
                <div class="lesson-section">
                    <h4>📚 Content</h4>
                    <div class="content-block">
                        <p>This lesson covers important English concepts with Kannada explanations to help you understand better.</p>
                        <p>Practice the sentences below to improve your speaking skills.</p>
                    </div>
                </div>
                
                <div class="lesson-section">
                    <h4>🗣️ Speaking Practice</h4>
                    <div class="speaking-practice-block">
                        <div class="sentence-item">
                            <span class="sentence">Hello, how are you?</span>
                            <span class="kannada">ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?</span>
                            <button class="btn-audio-mini" onclick="app.speakText('Hello, how are you?')">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="sentence-item">
                            <span class="sentence">My name is...</span>
                            <span class="kannada">ನನ್ನ ಹೆಸರು...</span>
                            <button class="btn-audio-mini" onclick="app.speakText('My name is')">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="lesson-actions">
                    <button class="btn-complete-lesson" onclick="app.completeLesson(${level}, ${lesson})">
                        <i class="fas fa-check"></i> Mark as Complete
                    </button>
                    <button class="btn-next-lesson" onclick="app.nextLesson(${level}, ${lesson})">
                        Next Lesson <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        document.getElementById('lessonContent').innerHTML = lessonContent;
        
        // Mark lesson as active
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.lesson) === lesson) {
                item.classList.add('active');
            }
        });
    }

    generateLessonsList(level) {
        const lessonCount = this.getLessonsCount(level);
        let lessons = '';
        
        for (let i = 1; i <= lessonCount; i++) {
            const isCompleted = this.progress[level]?.lessonsCompleted >= i;
            lessons += `
                <div class="lesson-item ${isCompleted ? 'completed' : ''}" data-lesson="${i}">
                    <span class="lesson-number">${i}</span>
                    <span class="lesson-title">Lesson ${i}</span>
                    ${isCompleted ? '<i class="fas fa-check-circle completed-icon"></i>' : ''}
                </div>
            `;
        }
        
        return lessons;
    }

    completeLesson(level, lesson) {
        if (!this.progress[level]) {
            this.progress[level] = {
                started: true,
                completed: false,
                lessonsCompleted: 0,
                totalLessons: this.getLessonsCount(level),
                quizScore: 0,
                speakingMinutes: 0
            };
        }

        if (lesson > this.progress[level].lessonsCompleted) {
            this.progress[level].lessonsCompleted = lesson;
        }

        // Check if level is complete
        if (this.progress[level].lessonsCompleted >= this.progress[level].totalLessons) {
            this.progress[level].completed = true;
        }

        this.saveProgress();
        this.updateLessonUI(level, lesson);
        this.showNotification('Lesson completed!', 'success');
    }

    nextLesson(level, currentLesson) {
        const totalLessons = this.getLessonsCount(level);
        if (currentLesson < totalLessons) {
            this.showLesson(level, currentLesson + 1);
        } else {
            this.showNotification('You have completed all lessons in this level!', 'success');
        }
    }

    updateLessonUI(level, lesson) {
        const lessonItem = document.querySelector(`.lesson-item[data-lesson="${lesson}"]`);
        if (lessonItem) {
            lessonItem.classList.add('completed');
            if (!lessonItem.querySelector('.completed-icon')) {
                lessonItem.innerHTML += '<i class="fas fa-check-circle completed-icon"></i>';
            }
        }

        const progressFill = document.querySelector('.level-progress-display .progress-fill');
        const progressText = document.querySelector('.level-progress-display .progress-text');
        if (progressFill && progressText) {
            const progress = this.getLevelProgress(level);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% complete`;
        }
    }

    getLevelProgress(level) {
        if (!this.progress[level]) return 0;
        const { lessonsCompleted, totalLessons } = this.progress[level];
        return Math.round((lessonsCompleted / totalLessons) * 100);
    }

    // Speaking Practice System
    setupSpeakingPractice() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.recordingTimer = null;
        this.recordingSeconds = 0;

        const startBtn = document.getElementById('startRecording');
        const stopBtn = document.getElementById('stopRecording');
        const playBtn = document.getElementById('playRecording');

        startBtn?.addEventListener('click', () => this.startRecording());
        stopBtn?.addEventListener('click', () => this.stopRecording());
        playBtn?.addEventListener('click', () => this.playRecording());
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.lastRecording = URL.createObjectURL(audioBlob);
                document.getElementById('playRecording').disabled = false;
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingSeconds = 0;

            document.getElementById('startRecording').disabled = true;
            document.getElementById('stopRecording').disabled = false;

            this.startRecordingTimer();
            this.showNotification('Recording started', 'success');

        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.showNotification('Could not access microphone', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopRecordingTimer();

            document.getElementById('startRecording').disabled = false;
            document.getElementById('stopRecording').disabled = true;

            this.updateSpeakingTime(this.recordingSeconds);
            this.showNotification('Recording stopped', 'success');
        }
    }

    playRecording() {
        if (this.lastRecording) {
            const audio = new Audio(this.lastRecording);
            audio.play();
        }
    }

    startRecordingTimer() {
        this.recordingTimer = setInterval(() => {
            this.recordingSeconds++;
            this.updateRecordingDisplay();
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
        }
    }

    updateRecordingDisplay() {
        const minutes = Math.floor(this.recordingSeconds / 60);
        const seconds = this.recordingSeconds % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const timerElement = document.getElementById('recordingTimer');
        if (timerElement) {
            timerElement.textContent = display;
        }
    }

    updateSpeakingTime(seconds) {
        const today = new Date().toDateString();
        if (!this.progress.speakingTime) {
            this.progress.speakingTime = {};
        }
        if (!this.progress.speakingTime[today]) {
            this.progress.speakingTime[today] = 0;
        }
        this.progress.speakingTime[today] += seconds;
        this.saveProgress();
    }

    // Audio System
    setupAudioSystem() {
        const audioButtons = document.querySelectorAll('.btn-audio');
        audioButtons.forEach(button => {
            button.addEventListener('click', () => {
                const audio = button.dataset.audio;
                this.playAudio(audio);
            });
        });
    }

    playAudio(audioId) {
        const texts = {
            'hello': 'Hello, how are you?',
            'name': 'My name is...',
        };

        if (texts[audioId]) {
            this.speakText(texts[audioId]);
        }
    }

    speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }

    // Quiz System
    openQuiz(level) {
        const quizContent = this.createQuizContent(level);
        
        const quizModal = document.createElement('div');
        quizModal.className = 'modal show';
        quizModal.id = 'quizModal';
        quizModal.innerHTML = `
            <div class="modal-content quiz-modal">
                <div class="modal-header">
                    <h2>Level ${level} Quiz</h2>
                    <button class="modal-close" onclick="app.closeQuiz()">&times;</button>
                </div>
                <div class="modal-body">
                    ${quizContent}
                </div>
            </div>
        `;
        document.body.appendChild(quizModal);

        this.setupQuiz(level);
    }

    createQuizContent(level) {
        return `
            <div class="quiz-container">
                <div class="quiz-info">
                    <p>Answer the following questions to test your understanding.</p>
                </div>
                
                <form id="quizForm">
                    <div class="quiz-question">
                        <p><strong>Question 1:</strong> What is the correct way to say "ನಮಸ್ಕಾರ" in English?</p>
                        <div class="quiz-options">
                            <label><input type="radio" name="q1" value="a"> Goodbye</label>
                            <label><input type="radio" name="q1" value="b"> Hello</label>
                            <label><input type="radio" name="q1" value="c"> Thank you</label>
                        </div>
                    </div>
                    
                    <div class="quiz-question">
                        <p><strong>Question 2:</strong> Complete the sentence: "My name _____ John."</p>
                        <div class="quiz-options">
                            <label><input type="radio" name="q2" value="a"> am</label>
                            <label><input type="radio" name="q2" value="b"> is</label>
                            <label><input type="radio" name="q2" value="c"> are</label>
                        </div>
                    </div>
                    
                    <div class="quiz-question">
                        <p><strong>Question 3:</strong> How do you ask "ನೀವು ಹೇಗಿದ್ದೀರಿ?" in English?</p>
                        <div class="quiz-options">
                            <label><input type="radio" name="q3" value="a"> What is your name?</label>
                            <label><input type="radio" name="q3" value="b"> How are you?</label>
                            <label><input type="radio" name="q3" value="c"> Where are you from?</label>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-submit">Submit Quiz</button>
                </form>
            </div>
        `;
    }

    setupQuiz(level) {
        document.getElementById('quizForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitQuiz(level);
        });
    }

    submitQuiz(level) {
        const answers = {
            q1: 'b',
            q2: 'b',
            q3: 'b'
        };

        let score = 0;
        let total = Object.keys(answers).length;

        for (const question in answers) {
            const selected = document.querySelector(`input[name="${question}"]:checked`);
            if (selected && selected.value === answers[question]) {
                score++;
            }
        }

        const percentage = Math.round((score / total) * 100);

        if (!this.progress[level]) {
            this.progress[level] = {
                started: true,
                completed: false,
                lessonsCompleted: 0,
                totalLessons: this.getLessonsCount(level),
                quizScore: 0,
                speakingMinutes: 0
            };
        }

        this.progress[level].quizScore = percentage;
        this.saveProgress();

        this.closeQuiz();
        this.showNotification(`Quiz completed! Score: ${percentage}%`, percentage >= 70 ? 'success' : 'info');
    }

    closeQuiz() {
        const quizModal = document.getElementById('quizModal');
        if (quizModal) {
            quizModal.remove();
        }
    }

    // Progress Tracking
    loadProgress() {
        const savedProgress = localStorage.getItem('kannadaEnglishProgress');
        return savedProgress ? JSON.parse(savedProgress) : {};
    }

    saveProgress() {
        localStorage.setItem('kannadaEnglishProgress', JSON.stringify(this.progress));
    }

    updateLevelCards() {
        const levelCards = document.querySelectorAll('.level-card');
        
        levelCards.forEach(card => {
            const level = parseInt(card.dataset.level);
            const progressFill = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');

            const progress = this.getLevelProgress(level);

            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            if (progressText) {
                progressText.textContent = `${progress}% complete`;
            }
        });
    }

    updateProgressPage() {
        const completedLevels = this.getStartedLevelsCount();
        const completedLessons = this.getTotalLessonsCompleted();
        const totalSpeakingMinutes = this.getTotalSpeakingMinutes();
        const quizAverage = this.getQuizAverage();

        document.getElementById('totalLevelsCompleted').textContent = completedLevels;
        document.getElementById('totalLessonsCompleted').textContent = completedLessons;
        document.getElementById('totalSpeakingMinutes').textContent = totalSpeakingMinutes;
        document.getElementById('quizAverage').textContent = `${quizAverage}%`;
    }

    getStartedLevelsCount() {
        let count = 0;
        for (let i = 0; i <= 9; i++) {
            if (this.progress[i]?.started) {
                count++;
            }
        }
        return count;
    }

    getTotalLessonsCompleted() {
        let total = 0;
        for (let i = 0; i <= 9; i++) {
            total += this.progress[i]?.lessonsCompleted || 0;
        }
        return total;
    }

    getTotalSpeakingMinutes() {
        let totalSeconds = 0;
        if (this.progress.speakingTime) {
            for (const day in this.progress.speakingTime) {
                totalSeconds += this.progress.speakingTime[day];
            }
        }
        return Math.round(totalSeconds / 60);
    }

    getQuizAverage() {
        let totalScore = 0;
        let quizCount = 0;

        for (let i = 0; i <= 9; i++) {
            if (this.progress[i]?.quizScore > 0) {
                totalScore += this.progress[i].quizScore;
                quizCount++;
            }
        }

        return quizCount > 0 ? Math.round(totalScore / quizCount) : 0;
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            color: white;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        notification.style.backgroundColor = colors[type];
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the app
const app = new KannadaEnglishApp();

// Add CSS for notification animation and other elements
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .btn-back {
        background-color: var(--secondary-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .level-content-container {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        margin-top: 2rem;
    }

    .level-sidebar {
        background-color: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow);
    }

    .lessons-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 1rem 0;
    }

    .lesson-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background-color: var(--light-color);
        border-radius: 5px;
        cursor: pointer;
        transition: var(--transition);
    }

    .lesson-item:hover {
        background-color: #d5d8dc;
    }

    .lesson-item.completed {
        background-color: #d4edda;
    }

    .lesson-item.active {
        background-color: var(--accent-color);
        color: white;
    }

    .lesson-number {
        width: 30px;
        height: 30px;
        background-color: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .completed-icon {
        color: var(--success-color);
        margin-left: auto;
    }

    .level-main {
        background-color: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: var(--shadow);
    }

    .lesson-placeholder {
        text-align: center;
        padding: 3rem;
        color: var(--text-color);
    }

    .lesson-placeholder i {
        font-size: 3rem;
        color: var(--accent-color);
        margin-bottom: 1rem;
    }

    .lesson-detail h3 {
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }

    .kannada-title {
        color: var(--secondary-color);
        font-style: italic;
        margin-bottom: 1.5rem;
    }

    .level-info {
        background-color: var(--light-color);
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1.5rem;
    }

    .lesson-section {
        margin-bottom: 2rem;
    }

    .lesson-section h4 {
        color: var(--secondary-color);
        margin-bottom: 1rem;
    }

    .content-block {
        background-color: var(--light-color);
        padding: 1rem;
        border-radius: 5px;
    }

    .kannada-explanation {
        color: var(--secondary-color);
        font-style: italic;
        margin-top: 0.5rem;
    }

    .speaking-practice-block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .sentence-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: var(--light-color);
        border-radius: 5px;
        flex-wrap: wrap;
    }

    .sentence {
        flex: 1;
        font-weight: 500;
        min-width: 200px;
    }

    .kannada {
        color: var(--secondary-color);
        font-style: italic;
        min-width: 200px;
    }

    .btn-audio-mini {
        background-color: var(--accent-color);
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 5px;
        cursor: pointer;
    }

    .lesson-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .btn-complete-lesson,
    .btn-next-lesson {
        padding: 1rem 2rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-complete-lesson {
        background-color: var(--success-color);
        color: white;
    }

    .btn-next-lesson {
        background-color: var(--primary-color);
        color: white;
    }

    .level-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        justify-content: center;
    }

    .quiz-modal {
        max-width: 700px;
    }

    .quiz-container {
        max-height: 70vh;
        overflow-y: auto;
    }

    .quiz-info {
        background-color: var(--light-color);
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1rem;
    }

    .quiz-question {
        margin-bottom: 1.5rem;
    }

    .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .quiz-options label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: var(--light-color);
        border-radius: 5px;
        cursor: pointer;
    }

    .quiz-options label:hover {
        background-color: #d5d8dc;
    }

    .progress-message {
        background-color: var(--light-color);
        padding: 1.5rem;
        border-radius: 10px;
        margin: 2rem 0;
    }

    .progress-message p {
        margin: 0.5rem 0;
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .level-content-container {
            grid-template-columns: 1fr;
        }

        .level-sidebar {
            order: 2;
        }

        .level-main {
            order: 1;
        }
    }
`;
document.head.appendChild(style);