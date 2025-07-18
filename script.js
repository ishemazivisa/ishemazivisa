document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Initialize skills radar chart and skill bars
    let skillsChart;
    initializeSkills();

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
    
    // Animate elements on scroll
    function animateOnScroll() {
        // Animate skill bars
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8 && !bar.style.width) {
                bar.style.width = bar.getAttribute('data-width');
            }
        });
        
        // Animate other elements
        document.querySelectorAll('.animate-text').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                element.classList.add('visible');
            }
        });
        
        // Animate project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8) {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('visible');
            }
        });
    }
    
    // Initial animation check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Skills Section Functions
    function initializeSkills() {
        initializeSkillsRadar();
        initializeSkillBars();
    }
    
    function initializeSkillsRadar() {
        const skillsCtx = document.getElementById('skillsRadar').getContext('2d');
        
        // Destroy previous chart if exists
        if (skillsChart) {
            skillsChart.destroy();
        }
        
        skillsChart = new Chart(skillsCtx, {
            type: 'radar',
            data: {
                labels: ['SQL', 'Power BI', 'Python', 'HTML/CSS', 'Data Visualization', 'Data Analysis'],
                datasets: [{
                    label: 'Technical Skills',
                    data: [90, 85, 80, 75, 85, 85],
                    backgroundColor: 'rgba(108, 99, 255, 0.2)',
                    borderColor: 'rgba(108, 99, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(108, 99, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(108, 99, 255, 1)',
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { stepSize: 20, backdropColor: 'transparent' }
                    }
                },
                plugins: { legend: { display: false } },
                elements: { line: { tension: 0.1 } }
            }
        });
    }
    
    function initializeSkillBars() {
        const skillCategories = {
            technical: [
                { name: 'SQL', value: 90 },
                { name: 'Power BI', value: 85 },
                { name: 'Python', value: 80 },
                { name: 'HTML/CSS', value: 75 },
                { name: 'Data Visualization', value: 85 }
            ],
            analytical: [
                { name: 'Data Analysis', value: 85 },
                { name: 'Data Mining', value: 80 },
                { name: 'Problem Solving', value: 90 },
                { name: 'Statistical Analysis', value: 75 }
            ],
            soft: [
                { name: 'Communication', value: 85 },
                { name: 'Teamwork', value: 90 },
                { name: 'Time Management', value: 80 },
                { name: 'Adaptability', value: 85 }
            ]
        };
        
        // Render initial skill bars
        renderSkillBars('technical');
        
        // Tab switching functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                renderSkillBars(category);
                
                // Update radar chart if exists
                if (skillsChart) {
                    updateRadarChart(category);
                }
            });
        });
        
        function renderSkillBars(category) {
            const container = document.querySelector('.skills-grid');
            container.innerHTML = '';
            
            skillCategories[category].forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.innerHTML = `
                    <div class="skill-info">
                        <span>${skill.name}</span>
                        <span>${skill.value}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="${skill.value}%"></div>
                    </div>
                `;
                container.appendChild(skillItem);
            });
            
            // Trigger animation
            setTimeout(() => {
                document.querySelectorAll('.skill-progress').forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            }, 100);
        }
        
        function updateRadarChart(category) {
            const radarData = {
                technical: {
                    labels: ['SQL', 'Power BI', 'Python', 'HTML/CSS', 'Data Visualization', 'Data Analysis'],
                    data: [90, 85, 80, 75, 85, 85]
                },
                analytical: {
                    labels: ['Data Analysis', 'Data Mining', 'Problem Solving', 'Statistical Analysis', 'Research', 'Critical Thinking'],
                    data: [85, 80, 90, 75, 80, 85]
                },
                soft: {
                    labels: ['Communication', 'Teamwork', 'Time Management', 'Adaptability', 'Creativity', 'Leadership'],
                    data: [85, 90, 80, 85, 75, 70]
                }
            };
            
            skillsChart.data.labels = radarData[category].labels;
            skillsChart.data.datasets[0].data = radarData[category].data;
            skillsChart.update();
        }
    }
});