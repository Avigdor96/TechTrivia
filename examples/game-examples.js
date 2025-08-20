/**
 * דוגמאות קוד JavaScript לטריוויה טכנולוגית
 * JavaScript Code Examples for Tech Trivia
 */

// === 1. טעינת שאלות מקובץ JSON ===
// Loading Questions from JSON File

class QuestionLoader {
    constructor() {
        this.questions = [];
        this.categories = {};
        this.settings = {};
    }

    /**
     * טעינת שאלות מקובץ JSON
     * Load questions from JSON file
     */
    async loadQuestions(jsonPath = './examples/questions.json') {
        try {
            const response = await fetch(jsonPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            this.questions = data.questions;
            this.categories = data.categories;
            this.settings = data.settings;
            
            console.log(`✅ נטענו ${this.questions.length} שאלות בהצלחה`);
            return this.questions;
            
        } catch (error) {
            console.error('❌ שגיאה בטעינת השאלות:', error);
            
            // חזרה לשאלות קבועות במקרה של שגיאה
            this.loadDefaultQuestions();
            return this.questions;
        }
    }

    /**
     * טעינת שאלות ברירת מחדל
     * Load default questions as fallback
     */
    loadDefaultQuestions() {
        this.questions = [
            {
                id: 1,
                question: "איזו חברה ייצרה את מערכת ההפעלה Windows?",
                answers: ["Apple", "Microsoft", "Google", "IBM"],
                correct: "Microsoft",
                category: "general",
                difficulty: "easy",
                points: 10
            },
            // יותר שאלות...
        ];
    }

    /**
     * קבלת שאלות לפי קטגוריה
     * Get questions by category
     */
    getQuestionsByCategory(category) {
        return this.questions.filter(q => q.category === category);
    }

    /**
     * קבלת שאלות לפי רמת קושי
     * Get questions by difficulty
     */
    getQuestionsByDifficulty(difficulty) {
        return this.questions.filter(q => q.difficulty === difficulty);
    }

    /**
     * בחירת שאלה אקראית
     * Get random question
     */
    getRandomQuestion(excludeIds = []) {
        const availableQuestions = this.questions.filter(q => !excludeIds.includes(q.id));
        
        if (availableQuestions.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        return availableQuestions[randomIndex];
    }
}

// === 2. מערכת טיימר מתקדמת ===
// Advanced Timer System

class GameTimer {
    constructor(initialTime = 30, onTick = null, onTimeout = null) {
        this.initialTime = initialTime;
        this.currentTime = initialTime;
        this.interval = null;
        this.isRunning = false;
        this.isPaused = false;
        
        // פונקציות callback
        this.onTick = onTick || this.defaultOnTick;
        this.onTimeout = onTimeout || this.defaultOnTimeout;
        
        // אלמנט DOM להצגת הטיימר
        this.displayElement = document.getElementById('timer');
    }

    /**
     * התחלת הטיימר
     * Start the timer
     */
    start() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.isPaused = false;
        
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.currentTime--;
                this.onTick(this.currentTime);
                
                // אזהרה כאשר נותרות 10 שניות
                if (this.currentTime <= 10) {
                    this.displayWarning();
                }
                
                // סיום הזמן
                if (this.currentTime <= 0) {
                    this.stop();
                    this.onTimeout();
                }
            }
        }, 1000);
        
        console.log('🕒 הטיימר החל');
    }

    /**
     * עצירת הטיימר
     * Stop the timer
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.isRunning = false;
        this.isPaused = false;
        
        console.log('⏹️ הטיימר הופסק');
    }

    /**
     * השהיית הטיימר
     * Pause the timer
     */
    pause() {
        if (this.isRunning) {
            this.isPaused = true;
            console.log('⏸️ הטיימר הושהה');
        }
    }

    /**
     * המשכת הטיימר
     * Resume the timer
     */
    resume() {
        if (this.isRunning && this.isPaused) {
            this.isPaused = false;
            console.log('▶️ הטיימר הומשך');
        }
    }

    /**
     * איפוס הטיימר
     * Reset the timer
     */
    reset(newTime = null) {
        this.stop();
        this.currentTime = newTime || this.initialTime;
        this.updateDisplay();
        
        console.log('🔄 הטיימר אופס');
    }

    /**
     * הוספת זמן
     * Add time
     */
    addTime(seconds) {
        this.currentTime += seconds;
        this.updateDisplay();
        
        console.log(`➕ נוספו ${seconds} שניות`);
    }

    /**
     * עדכון תצוגת הטיימר
     * Update timer display
     */
    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.textContent = this.currentTime;
            
            // שינוי צבע בהתאם לזמן הנותר
            if (this.currentTime <= 10) {
                this.displayElement.classList.add('timer-warning');
            } else {
                this.displayElement.classList.remove('timer-warning');
            }
        }
    }

    /**
     * הצגת אזהרה כאשר הזמן אוזל
     * Display warning when time is running out
     */
    displayWarning() {
        if (this.displayElement) {
            this.displayElement.classList.add('timer-warning');
            
            // רטט אם נתמך
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        }
    }

    /**
     * פונקציית ברירת מחדל לכל שנייה
     * Default tick function
     */
    defaultOnTick(timeLeft) {
        this.updateDisplay();
        console.log(`⏰ נותרו ${timeLeft} שניות`);
    }

    /**
     * פונקציית ברירת מחדל לסיום הזמן
     * Default timeout function
     */
    defaultOnTimeout() {
        console.log('⏰ הזמן נגמר!');
        this.updateDisplay();
    }
}

// === 3. מערכת localStorage מתקדמת ===
// Advanced localStorage System

class GameStorage {
    constructor() {
        this.storageKeys = {
            USERS: 'techTrivia_users',
            CURRENT_USER: 'techTrivia_currentUser',
            GAME_SETTINGS: 'techTrivia_gameSettings',
            STATISTICS: 'techTrivia_statistics',
            HIGH_SCORES: 'techTrivia_highScores'
        };
    }

    /**
     * שמירת נתוני משתמש
     * Save user data
     */
    saveUser(userData) {
        try {
            const users = this.getUsers();
            users[userData.username] = {
                ...userData,
                lastLogin: new Date().toISOString(),
                totalGames: (users[userData.username]?.totalGames || 0) + 1
            };
            
            localStorage.setItem(this.storageKeys.USERS, JSON.stringify(users));
            
            console.log(`💾 נתוני המשתמש ${userData.username} נשמרו`);
            return true;
            
        } catch (error) {
            console.error('❌ שגיאה בשמירת נתוני משתמש:', error);
            return false;
        }
    }

    /**
     * קבלת כל המשתמשים
     * Get all users
     */
    getUsers() {
        try {
            const users = localStorage.getItem(this.storageKeys.USERS);
            return users ? JSON.parse(users) : {};
        } catch (error) {
            console.error('❌ שגיאה בקריאת נתוני משתמשים:', error);
            return {};
        }
    }

    /**
     * קבלת נתוני משתמש ספציפי
     * Get specific user data
     */
    getUser(username) {
        const users = this.getUsers();
        return users[username] || null;
    }

    /**
     * הגדרת משתמש נוכחי
     * Set current user
     */
    setCurrentUser(username) {
        try {
            localStorage.setItem(this.storageKeys.CURRENT_USER, username);
            console.log(`👤 המשתמש הנוכחי הוגדר ל-${username}`);
            return true;
        } catch (error) {
            console.error('❌ שגיאה בהגדרת משתמש נוכחי:', error);
            return false;
        }
    }

    /**
     * קבלת המשתמש הנוכחי
     * Get current user
     */
    getCurrentUser() {
        try {
            const username = localStorage.getItem(this.storageKeys.CURRENT_USER);
            return username ? this.getUser(username) : null;
        } catch (error) {
            console.error('❌ שגיאה בקריאת המשתמש הנוכחי:', error);
            return null;
        }
    }

    /**
     * שמירת תוצאות משחק
     * Save game results
     */
    saveGameResult(gameResult) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                throw new Error('אין משתמש מחובר');
            }

            // עדכון נתוני המשתמש
            const updatedUser = {
                ...currentUser,
                score: (currentUser.score || 0) + gameResult.score,
                correctAnswers: (currentUser.correctAnswers || 0) + gameResult.correct,
                incorrectAnswers: (currentUser.incorrectAnswers || 0) + gameResult.incorrect,
                gamesPlayed: (currentUser.gamesPlayed || 0) + 1,
                lastGameDate: new Date().toISOString()
            };

            // חישוב אחוז הצלחה
            const totalAnswers = updatedUser.correctAnswers + updatedUser.incorrectAnswers;
            updatedUser.successRate = totalAnswers > 0 ? 
                Math.round((updatedUser.correctAnswers / totalAnswers) * 100) : 0;

            this.saveUser(updatedUser);

            // שמירת שיא אישי
            this.updateHighScore(currentUser.username, gameResult.score);

            // שמירת סטטיסטיקות כלליות
            this.updateStatistics(gameResult);

            console.log('🎮 תוצאות המשחק נשמרו בהצלחה');
            return true;

        } catch (error) {
            console.error('❌ שגיאה בשמירת תוצאות המשחק:', error);
            return false;
        }
    }

    /**
     * עדכון שיאים
     * Update high scores
     */
    updateHighScore(username, score) {
        try {
            const highScores = this.getHighScores();
            
            // בדיקה אם זה שיא חדש עבור המשתמש
            const userHighScore = highScores.find(entry => entry.username === username);
            
            if (!userHighScore || score > userHighScore.score) {
                // הסרת הכניסה הקודמת אם קיימת
                const filteredScores = highScores.filter(entry => entry.username !== username);
                
                // הוספת השיא החדש
                filteredScores.push({
                    username,
                    score,
                    date: new Date().toISOString()
                });
                
                // מיון לפי ניקוד (גבוה לנמוך) ושמירת 10 הראשונים
                const sortedScores = filteredScores
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);
                
                localStorage.setItem(this.storageKeys.HIGH_SCORES, JSON.stringify(sortedScores));
                
                console.log(`🏆 שיא חדש למשתמש ${username}: ${score} נקודות`);
            }
            
        } catch (error) {
            console.error('❌ שגיאה בעדכון שיאים:', error);
        }
    }

    /**
     * קבלת לוח השיאים
     * Get high scores
     */
    getHighScores() {
        try {
            const highScores = localStorage.getItem(this.storageKeys.HIGH_SCORES);
            return highScores ? JSON.parse(highScores) : [];
        } catch (error) {
            console.error('❌ שגיאה בקריאת לוח השיאים:', error);
            return [];
        }
    }

    /**
     * עדכון סטטיסטיקות כלליות
     * Update general statistics
     */
    updateStatistics(gameResult) {
        try {
            const stats = this.getStatistics();
            
            stats.totalGames = (stats.totalGames || 0) + 1;
            stats.totalQuestions = (stats.totalQuestions || 0) + gameResult.totalQuestions;
            stats.totalCorrect = (stats.totalCorrect || 0) + gameResult.correct;
            stats.totalIncorrect = (stats.totalIncorrect || 0) + gameResult.incorrect;
            stats.averageScore = stats.totalGames > 0 ? 
                Math.round(stats.totalCorrect / stats.totalGames * 100) / 100 : 0;
            
            localStorage.setItem(this.storageKeys.STATISTICS, JSON.stringify(stats));
            
        } catch (error) {
            console.error('❌ שגיאה בעדכון סטטיסטיקות:', error);
        }
    }

    /**
     * קבלת סטטיסטיקות
     * Get statistics
     */
    getStatistics() {
        try {
            const stats = localStorage.getItem(this.storageKeys.STATISTICS);
            return stats ? JSON.parse(stats) : {};
        } catch (error) {
            console.error('❌ שגיאה בקריאת סטטיסטיקות:', error);
            return {};
        }
    }

    /**
     * ניקוי נתונים
     * Clear data
     */
    clearData(dataType = 'all') {
        try {
            switch (dataType) {
                case 'users':
                    localStorage.removeItem(this.storageKeys.USERS);
                    localStorage.removeItem(this.storageKeys.CURRENT_USER);
                    break;
                case 'scores':
                    localStorage.removeItem(this.storageKeys.HIGH_SCORES);
                    break;
                case 'statistics':
                    localStorage.removeItem(this.storageKeys.STATISTICS);
                    break;
                case 'all':
                    Object.values(this.storageKeys).forEach(key => {
                        localStorage.removeItem(key);
                    });
                    break;
            }
            
            console.log(`🗑️ נתונים נוקו: ${dataType}`);
            return true;
            
        } catch (error) {
            console.error('❌ שגיאה בניקוי נתונים:', error);
            return false;
        }
    }

    /**
     * גיבוי נתונים
     * Backup data
     */
    exportData() {
        try {
            const data = {};
            
            Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
                const item = localStorage.getItem(storageKey);
                if (item) {
                    data[key] = JSON.parse(item);
                }
            });
            
            const dataBlob = new Blob([JSON.stringify(data, null, 2)], 
                { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `techTrivia_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            console.log('💾 נתונים יוצאו בהצלחה');
            return true;
            
        } catch (error) {
            console.error('❌ שגיאה ביצוא נתונים:', error);
            return false;
        }
    }
}

// === 4. דוגמת שימוש ===
// Usage Example

// אתחול המערכות
const questionLoader = new QuestionLoader();
const gameTimer = new GameTimer(30);
const gameStorage = new GameStorage();

// טעינת שאלות
async function initGame() {
    console.log('🎮 מתחיל משחק חדש...');
    
    // טעינת שאלות
    await questionLoader.loadQuestions();
    
    // יצירת משתמש חדש או התחברות
    const user = {
        username: 'player1',
        email: 'player1@example.com',
        score: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
    };
    
    gameStorage.saveUser(user);
    gameStorage.setCurrentUser(user.username);
    
    // התחלת משחק
    startNewGame();
}

function startNewGame() {
    let currentQuestion = null;
    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    const usedQuestions = [];

    // קבלת שאלה חדשה
    function getNextQuestion() {
        currentQuestion = questionLoader.getRandomQuestion(usedQuestions);
        
        if (!currentQuestion) {
            endGame();
            return;
        }
        
        usedQuestions.push(currentQuestion.id);
        displayQuestion(currentQuestion);
        
        // התחלת טיימר
        gameTimer.reset();
        gameTimer.start();
    }

    // הצגת שאלה
    function displayQuestion(question) {
        console.log(`❓ שאלה: ${question.question}`);
        console.log('תשובות:', question.answers);
    }

    // טיפול בתשובה
    function handleAnswer(selectedAnswer) {
        gameTimer.stop();
        
        const isCorrect = selectedAnswer === currentQuestion.correct;
        
        if (isCorrect) {
            correctAnswers++;
            score += currentQuestion.points || 10;
            console.log('✅ תשובה נכונה!');
        } else {
            incorrectAnswers++;
            console.log('❌ תשובה שגויה!');
            console.log(`התשובה הנכונה: ${currentQuestion.correct}`);
        }
        
        // עבור לשאלה הבאה לאחר הפסקה קצרה
        setTimeout(getNextQuestion, 2000);
    }

    // סיום המשחק
    function endGame() {
        const gameResult = {
            score,
            correct: correctAnswers,
            incorrect: incorrectAnswers,
            totalQuestions: usedQuestions.length
        };
        
        // שמירת התוצאות
        gameStorage.saveGameResult(gameResult);
        
        console.log('🎯 המשחק הסתיים!');
        console.log(`ניקוד סופי: ${score}`);
        console.log(`תשובות נכונות: ${correctAnswers}`);
        console.log(`תשובות שגויות: ${incorrectAnswers}`);
        
        // הצגת לוח השיאים
        displayHighScores();
    }

    // הצגת לוח השיאים
    function displayHighScores() {
        const highScores = gameStorage.getHighScores();
        console.log('🏆 לוח השיאים:');
        highScores.forEach((entry, index) => {
            console.log(`${index + 1}. ${entry.username}: ${entry.score} נקודות`);
        });
    }

    // התחלת המשחק
    getNextQuestion();
}

// התחלת המשחק
// initGame();

export { QuestionLoader, GameTimer, GameStorage };