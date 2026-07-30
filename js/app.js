// Simplified Kannada English App - No Authentication Required
class KannadaEnglishApp {
    constructor() {
        this.currentLevel = 0;
        this.progress = this.loadProgress();
        this.currentLevelData = null; // Store current level data
        this.originalLevelsPageHTML = null;
    }

    init() {
        try {
            // Snapshot the levels page's original markup (quick-nav, filters,
            // Kannada banner, level cards) before any navigation can replace it
            const levelsPage = document.getElementById('levels');
            if (levelsPage) {
                this.originalLevelsPageHTML = levelsPage.innerHTML;
            }
            this.setupNavigation();
            this.setupLevelSystem();
            this.setupSpeakingPractice();
            this.setupAudioSystem();
            this.updateProgressPage();
            this.updateLevelCards();
            // Show levels page by default
            this.navigateTo('levels');
        } catch (error) {
            console.error('Error initializing app:', error);
            // Fallback: ensure levels page is visible
            const levelsPage = document.getElementById('levels');
            const homePage = document.getElementById('home');
            if (levelsPage && homePage) {
                homePage.classList.remove('active');
                levelsPage.classList.add('active');
            }
        }
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

        // Quick navigation buttons
        this.setupQuickNavigation();
        this.setupLevelFilters();
    }

    setupQuickNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                this.scrollToLevel(level);
                
                // Update active state
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setupLevelFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterLevels(filter);
                
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    scrollToLevel(level) {
        const levelCard = document.querySelector(`.level-card[data-level="${level}"]`);
        if (levelCard) {
            levelCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the card temporarily
            levelCard.style.transform = 'scale(1.05)';
            setTimeout(() => {
                levelCard.style.transform = '';
            }, 500);
        }
    }

    filterLevels(filter) {
        const levelCards = document.querySelectorAll('.level-card');
        levelCards.forEach(card => {
            const level = parseInt(card.dataset.level);
            let shouldShow = true;
            
            if (filter === 'beginner') {
                shouldShow = level >= 0 && level <= 3;
            } else if (filter === 'intermediate') {
                shouldShow = level >= 4 && level <= 6;
            } else if (filter === 'advanced') {
                shouldShow = level >= 7 && level <= 9;
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
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
                'progress': 'My Progress',
                'resources': 'Resources',
                'about': 'About'
            };
            if (currentPage) {
                currentPage.textContent = pageNames[page] || page;
            }
        }
    }

    // Restore original levels page content (quick-nav, filters, Kannada
    // banner, level cards) after it was replaced by a level's detail view
    restoreLevelsPage() {
        const levelsPage = document.getElementById('levels');
        if (!levelsPage) return;

        if (this.originalLevelsPageHTML) {
            levelsPage.innerHTML = this.originalLevelsPageHTML;
        }

        // Re-setup event listeners lost when the DOM was replaced
        this.setupLevelSystem();
        this.setupQuickNavigation();
        this.setupLevelFilters();
        this.updateLevelCards();
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
        // If we have live data loaded, use that
        if (this.currentLevelData && this.currentLevelData.lessons) {
            return this.currentLevelData.lessons.length;
        }
        const lessonsCount = {
            0: 11,
            1: 17,
            2: 25,
            3: 21,
            4: 23,
            5: 25,
            6: 23,
            7: 17,
            8: 25,
            9: 13
        };
        return lessonsCount[level] || 10;
    }

    showLevelContent(level, levelData = null) {
        console.log('showLevelContent called with level:', level);
        this.currentLevel = level; // Store current level
        // Load level content from JSON if available
        if (levelData) {
            this.currentLevelData = levelData;
            const levelContent = this.createLevelContentHTML(level, levelData);
            
            // Replace the levels page content with level content
            const levelsPage = document.getElementById('levels');
            levelsPage.innerHTML = levelContent;
            
            // Setup level-specific functionality
            this.setupLevelContent(level, levelData);
        } else {
            // Load from JSON file
            fetch('data/courseContent.json')
                .then(response => response.json())
                .then(data => {
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
                })
                .catch(error => {
                    console.error('Error loading level content:', error);
                    this.showPlaceholderLevelContent(level);
                });
        }
    }

    showPlaceholderLevelContent(level) {
        console.log('showPlaceholderLevelContent called for level:', level);
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
            'Nouns, articles, pronouns, adjectives, adverbs, conjunctions, comparatives, sentence structure',
            'Prepositions, imperatives, possessives, Wh-questions, past tense introduction',
            'Past continuous, modals, present/past/future perfect, used to',
            'Shopping, travel, phone, phrasal verbs, idioms, collocations',
            'People, places, opinions, relative clauses, conditionals',
            'Office, emails, interviews',
            'Gerunds, tag questions, causatives, reported speech, passive voice, wishes',
            'Advanced speaking, presentations'
        ];

        const levelContent = `
            <div class="container">
                <button class="btn-back" onclick="window.app.navigateTo('levels')">
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
                    <button class="btn-primary" onclick="window.app.openQuiz(${level})">
                        <i class="fas fa-question-circle"></i> Take Level Quiz
                    </button>
                    <button class="btn-secondary" onclick="window.app.navigateTo('practice')">
                        <i class="fas fa-microphone"></i> Practice Speaking
                    </button>
                </div>
            </div>
        `;

        const levelsPage = document.getElementById('levels');
        levelsPage.innerHTML = levelContent;
        
        this.setupLevelContent(level);
        console.log('Placeholder level content loaded');
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
                <button class="btn-back" onclick="window.app.navigateTo('levels')">
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
                    <button class="btn-primary" onclick="window.app.openQuiz(${level})">
                        <i class="fas fa-question-circle"></i> Take Level Quiz
                    </button>
                    <button class="btn-secondary" onclick="window.app.navigateTo('practice')">
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
        console.log('showLessonFromJSON called with level:', level, 'lesson:', lesson);
        // Get total lessons in current level
        const totalLessons = this.currentLevelData ? this.currentLevelData.lessons.length : this.getLessonsCount(level);
        console.log('totalLessons:', totalLessons);
        
        let speakingPracticeHTML = '';
        if (lessonData.speakingPractice && lessonData.speakingPractice.length > 0) {
            speakingPracticeHTML = lessonData.speakingPractice.map(item => `
                <div class="sentence-item">
                    <div class="sentence-text-group">
                        <span class="sentence">${item.english}</span>
                        ${item.transliteration ? `<span class="transliteration">${item.transliteration}</span>` : ''}
                        <span class="kannada">${item.kannada}</span>
                    </div>
                    <button class="btn-audio-mini" onclick="window.app.speakText('${item.english.replace(/'/g, "\\'")}')">
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

        // Render practice questions
        let practiceQuestionsHTML = '';
        if (lessonData.practiceQuestions && lessonData.practiceQuestions.length > 0) {
            const questionsToShow = lessonData.practiceQuestions.slice(0, 5);
            practiceQuestionsHTML = `
                <div class="lesson-section">
                    <h4>📝 Practice Questions</h4>
                    <div class="practice-questions-block">
                        ${questionsToShow.map((q, idx) => `
                            <div class="practice-question" data-question="${idx}" data-correct="${q.correct}">
                                <p class="pq-text"><strong>Q${idx+1}.</strong> ${q.question}</p>
                                <div class="pq-options">
                                    ${q.options.map((opt, oi) => `
                                        <label class="pq-option" data-idx="${oi}">
                                            <input type="radio" name="pq_${lesson}_${idx}" value="${oi}">
                                            <span>${opt}</span>
                                        </label>
                                    `).join('')}
                                </div>
                                <div class="pq-feedback" style="display:none;"></div>
                            </div>
                        `).join('')}
                        <button class="btn-check-answers" onclick="window.app.checkPracticeAnswers(${lesson})">
                            <i class="fas fa-check-circle"></i> Check Answers
                        </button>
                    </div>
                </div>
            `;
        }

        // Render common mistakes
        let commonMistakesHTML = '';
        if (lessonData.commonMistakes && lessonData.commonMistakes.length > 0) {
            commonMistakesHTML = `
                <div class="lesson-section">
                    <h4>⚠️ Common Mistakes</h4>
                    <div class="common-mistakes-block">
                        ${lessonData.commonMistakes.map(m => `
                            <div class="mistake-item">
                                <div class="mistake-wrong">❌ ${m.mistake}</div>
                                <div class="mistake-correct">✅ ${m.correction}</div>
                                <div class="mistake-explain">${m.explanation}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // CEFR badge
        const cefrBadge = lessonData.cefr ? `<span class="cefr-badge">${lessonData.cefr}</span>` : '';

        const lessonContent = `
            <div class="lesson-detail">
                <div class="lesson-navigation">
                    <button class="btn-back-lesson" onclick="window.app.showLessonList(${level})">
                        <i class="fas fa-arrow-left"></i> Back to Lessons
                    </button>
                    <div class="lesson-nav-buttons">
                        <button class="btn-nav-lesson" onclick="window.app.showPreviousLesson(${level}, ${lesson})" ${lesson === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
                        <span class="lesson-indicator">Lesson ${lesson} of ${totalLessons}</span>
                        <button class="btn-nav-lesson" onclick="window.app.showNextLesson(${level}, ${lesson})" ${lesson === totalLessons ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
                <h3>${lessonData.title} ${cefrBadge}</h3>
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
                            <button class="btn-audio-mini" onclick="window.app.speakText('Hello, how are you?')">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        `}
                    </div>
                </div>
                
                ${(() => {
                    if (window.KannadaInterference) {
                        const tip = window.KannadaInterference.getRandomTip(level);
                        if (tip) {
                            return `
                            <div class="lesson-section interference-tip-section">
                                <h4>💡 Kannada Speaker Tip</h4>
                                <div class="interference-tip">
                                    <div class="tip-pattern"><strong>${tip.pattern}</strong></div>
                                    <div class="tip-example">Example: <em>${tip.example}</em></div>
                                    <div class="tip-correction">${tip.tip}</div>
                                </div>
                            </div>`;
                        }
                    }
                    return '';
                })()}
                
                ${practiceQuestionsHTML}
                ${commonMistakesHTML}
                
                <div class="lesson-actions">
                    <button class="btn-complete-lesson" onclick="window.app.completeLesson(${level}, ${lesson})">
                        <i class="fas fa-check"></i> Mark as Complete
                    </button>
                    <button class="btn-next-lesson" onclick="window.app.nextLesson(${level}, ${lesson})">
                        Next Lesson <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        let lessonContentElement = document.getElementById('lessonContent');
        if (!lessonContentElement) {
            console.error('lessonContent element not found, attempting to create it');
            // Try multiple approaches to find or create the element
            const levelMain = document.querySelector('.level-main');
            if (levelMain) {
                lessonContentElement = document.createElement('div');
                lessonContentElement.className = 'lesson-content';
                lessonContentElement.id = 'lessonContent';
                levelMain.appendChild(lessonContentElement);
                console.log('Created lessonContent element in levelMain');
            } else {
                // Try to find the levels page and recreate the structure
                const levelsPage = document.getElementById('levels');
                if (levelsPage) {
                    console.log('Recreating level structure in levels page');
                    // We need to reload the level content first
                    this.showLevelContent(level);
                    return;
                } else {
                    console.error('Neither levelMain nor levels page found');
                    return;
                }
            }
        }
        
        console.log('Setting lesson content HTML');
        try {
            lessonContentElement.innerHTML = lessonContent;
            console.log('Lesson content HTML set successfully');
            
            // Verify content was set
            if (lessonContentElement.innerHTML === '') {
                console.error('Lesson content is empty after setting');
            } else {
                console.log('Lesson content length:', lessonContentElement.innerHTML.length);
            }
            
            // Force a reflow to ensure content is rendered
            lessonContentElement.offsetHeight;
            console.log('Reflow forced');
        } catch (error) {
            console.error('Error setting lesson content HTML:', error);
        }
        
        // Mark lesson as active
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.lesson) === lesson) {
                item.classList.add('active');
            }
        });
    }

    showLesson(level, lesson) {
        console.log('showLesson called with level:', level, 'lesson:', lesson);
        const totalLessons = this.getLessonsCount(level);
        console.log('totalLessons:', totalLessons);
        
        const lessonContent = `
            <div class="lesson-detail">
                <div class="lesson-navigation">
                    <button class="btn-back-lesson" onclick="window.app.showLessonList(${level})">
                        <i class="fas fa-arrow-left"></i> Back to Lessons
                    </button>
                    <div class="lesson-nav-buttons">
                        <button class="btn-nav-lesson" onclick="window.app.showPreviousLesson(${level}, ${lesson})" ${lesson === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
                        <span class="lesson-indicator">Lesson ${lesson} of ${totalLessons}</span>
                        <button class="btn-nav-lesson" onclick="window.app.showNextLesson(${level}, ${lesson})" ${lesson === totalLessons ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
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
                            <button class="btn-audio-mini" onclick="window.app.speakText('Hello, how are you?')">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="sentence-item">
                            <span class="sentence">My name is...</span>
                            <span class="kannada">ನನ್ನ ಹೆಸರು...</span>
                            <button class="btn-audio-mini" onclick="window.app.speakText('My name is')">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="lesson-actions">
                    <button class="btn-complete-lesson" onclick="window.app.completeLesson(${level}, ${lesson})">
                        <i class="fas fa-check"></i> Mark as Complete
                    </button>
                    <button class="btn-next-lesson" onclick="window.app.nextLesson(${level}, ${lesson})">
                        Next Lesson <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        let lessonContentElement = document.getElementById('lessonContent');
        if (!lessonContentElement) {
            console.error('lessonContent element not found, attempting to create it');
            // Try multiple approaches to find or create the element
            const levelMain = document.querySelector('.level-main');
            if (levelMain) {
                lessonContentElement = document.createElement('div');
                lessonContentElement.className = 'lesson-content';
                lessonContentElement.id = 'lessonContent';
                levelMain.appendChild(lessonContentElement);
                console.log('Created lessonContent element in levelMain');
            } else {
                // Try to find the levels page and recreate the structure
                const levelsPage = document.getElementById('levels');
                if (levelsPage) {
                    console.log('Recreating level structure in levels page');
                    // We need to reload the level content first
                    this.showLevelContent(level);
                    return;
                } else {
                    console.error('Neither levelMain nor levels page found');
                    return;
                }
            }
        }
        
        console.log('Setting lesson content HTML');
        try {
            lessonContentElement.innerHTML = lessonContent;
            console.log('Lesson content HTML set successfully');
            
            // Verify content was set
            if (lessonContentElement.innerHTML === '') {
                console.error('Lesson content is empty after setting');
            } else {
                console.log('Lesson content length:', lessonContentElement.innerHTML.length);
            }
            
            // Force a reflow to ensure content is rendered
            lessonContentElement.offsetHeight;
            console.log('Reflow forced');
        } catch (error) {
            console.error('Error setting lesson content HTML:', error);
        }
        
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
        console.log('nextLesson called with level:', level, 'currentLesson:', currentLesson);
        const totalLessons = this.getLessonsCount(level);
        console.log('totalLessons:', totalLessons);
        if (currentLesson < totalLessons) {
            // Use showNextLesson to load actual lesson data from JSON
            this.showNextLesson(level, currentLesson);
        } else {
            this.showNotification('You have completed all lessons in this level!', 'success');
        }
    }

    showLessonList(level) {
        console.log('showLessonList called for level:', level);
        // Show the lesson placeholder to go back to the lesson list
        const lessonContent = `
            <div class="lesson-placeholder">
                <i class="fas fa-book-open"></i>
                <h3>Select a lesson to begin</h3>
                <p>Choose a lesson from the sidebar to start learning</p>
            </div>
        `;
        
        const lessonContentElement = document.getElementById('lessonContent');
        if (lessonContentElement) {
            lessonContentElement.innerHTML = lessonContent;
        } else {
            console.error('lessonContent element not found in showLessonList');
            // Try to recreate the level structure
            this.showLevelContent(level);
            return;
        }
        
        // Remove active class from all lessons
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    showPreviousLesson(level, currentLesson) {
        console.log('showPreviousLesson called with level:', level, 'currentLesson:', currentLesson);
        
        // Check if level content is loaded
        const levelMain = document.querySelector('.level-main');
        if (!levelMain) {
            console.log('Level content not loaded, reloading level content');
            this.showLevelContent(level);
            // After reloading, try to show the lesson
            setTimeout(() => {
                this.showPreviousLesson(level, currentLesson);
            }, 100);
            return;
        }
        
        if (currentLesson > 1) {
            if (this.currentLevelData && this.currentLevelData.lessons && this.currentLevelData.lessons[currentLesson - 2]) {
                this.showLessonFromJSON(level, currentLesson - 1, this.currentLevelData.lessons[currentLesson - 2]);
            } else {
                this.showLesson(level, currentLesson - 1);
            }
        }
    }

    showNextLesson(level, currentLesson) {
        console.log('showNextLesson called with level:', level, 'currentLesson:', currentLesson);
        
        // Check if level content is loaded
        const levelMain = document.querySelector('.level-main');
        if (!levelMain) {
            console.log('Level content not loaded, reloading level content');
            this.showLevelContent(level);
            // After reloading, try to show the lesson
            setTimeout(() => {
                this.showNextLesson(level, currentLesson);
            }, 100);
            return;
        }
        
        const totalLessons = this.currentLevelData ? this.currentLevelData.lessons.length : this.getLessonsCount(level);
        console.log('totalLessons:', totalLessons);
        if (currentLesson < totalLessons) {
            if (this.currentLevelData && this.currentLevelData.lessons && this.currentLevelData.lessons[currentLesson]) {
                console.log('Loading lesson from JSON');
                this.showLessonFromJSON(level, currentLesson + 1, this.currentLevelData.lessons[currentLesson]);
            } else {
                console.log('Loading lesson from template');
                this.showLesson(level, currentLesson + 1);
            }
        } else {
            this.showNotification('This is the last lesson!', 'info');
        }
    }

    showPreviousLesson(level, currentLesson) {
        console.log('showPreviousLesson called with level:', level, 'currentLesson:', currentLesson);
        
        // Check if level content is loaded
        const levelMain = document.querySelector('.level-main');
        if (!levelMain) {
            console.log('Level content not loaded, reloading level content');
            this.showLevelContent(level);
            // After reloading, try to show the lesson
            setTimeout(() => {
                this.showPreviousLesson(level, currentLesson);
            }, 100);
            return;
        }
        
        if (currentLesson > 1) {
            if (this.currentLevelData && this.currentLevelData.lessons && this.currentLevelData.lessons[currentLesson - 2]) {
                this.showLessonFromJSON(level, currentLesson - 1, this.currentLevelData.lessons[currentLesson - 2]);
            } else {
                this.showLesson(level, currentLesson - 1);
            }
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
                    <button class="modal-close" onclick="window.app.closeQuiz()">&times;</button>
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

    checkPracticeAnswers(lesson) {
        const questions = document.querySelectorAll('.practice-question');
        let correct = 0;
        let total = questions.length;
        
        questions.forEach(q => {
            const correctAnswer = parseInt(q.dataset.correct);
            const selected = q.querySelector('input[type="radio"]:checked');
            const feedback = q.querySelector('.pq-feedback');
            
            if (selected) {
                const selectedValue = parseInt(selected.value);
                if (selectedValue === correctAnswer) {
                    correct++;
                    feedback.innerHTML = '<span style="color:#27ae60;">✅ Correct!</span>';
                    feedback.style.display = 'block';
                } else {
                    feedback.innerHTML = '<span style="color:#e74c3c;">❌ Incorrect</span>';
                    feedback.style.display = 'block';
                }
            } else {
                feedback.innerHTML = '<span style="color:#f39c12;">⚠️ Not answered</span>';
                feedback.style.display = 'block';
            }
        });
        
        this.showNotification(`Score: ${correct}/${total} correct!`, correct === total ? 'success' : 'info');
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

    .cefr-badge {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        background-color: #3498db;
        color: white;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: bold;
        vertical-align: middle;
        margin-left: 0.5rem;
    }

    .practice-questions-block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .practice-question {
        background-color: var(--light-color);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid var(--primary-color);
    }

    .pq-text {
        margin-bottom: 0.5rem;
    }

    .pq-options {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .pq-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.8rem;
        background-color: white;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .pq-option:hover {
        background-color: #d5d8dc;
    }

    .pq-feedback {
        margin-top: 0.5rem;
        font-weight: bold;
    }

    .btn-check-answers {
        background-color: var(--accent-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        font-size: 1rem;
    }

    .btn-check-answers:hover {
        opacity: 0.9;
    }

    .common-mistakes-block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .mistake-item {
        background-color: #fff3cd;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #f39c12;
    }

    .mistake-wrong {
        color: #e74c3c;
        font-weight: 500;
        margin-bottom: 0.3rem;
    }

    .mistake-correct {
        color: #27ae60;
        font-weight: 500;
        margin-bottom: 0.3rem;
    }

    .mistake-explain {
        color: #555;
        font-size: 0.9rem;
        font-style: italic;
    }

    .pattern-item {
        background-color: var(--light-color);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }

    .pattern-examples {
        margin-top: 0.5rem;
        padding-left: 1rem;
        color: #555;
    }

    .pattern-examples div {
        padding: 0.2rem 0;
    }

    .vocab-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        background-color: var(--light-color);
        border-radius: 5px;
        margin-bottom: 0.3rem;
    }

    .vocab-english {
        font-weight: 500;
    }

    .vocab-kannada {
        color: var(--secondary-color);
        font-style: italic;
    }

    .lesson-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .lesson-nav-buttons {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-nav-lesson {
        background-color: var(--secondary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .btn-nav-lesson:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-back-lesson {
        background-color: transparent;
        color: var(--secondary-color);
        border: 1px solid var(--secondary-color);
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .lesson-indicator {
        font-weight: 500;
        color: var(--text-color);
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