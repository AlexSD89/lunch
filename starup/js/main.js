document.addEventListener('DOMContentLoaded', () => {
    // 页面加载动画
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }

    // 鼠标跟随效果
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    let cursorVisible = false;

    const moveCursor = (e) => {
        const mouseY = e.clientY;
        const mouseX = e.clientX;
        
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        if (!cursorVisible) {
            cursor.style.opacity = 1;
            cursorVisible = true;
        }
    }

    document.addEventListener('mousemove', moveCursor);

    // 滚动动画
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    // 监听需要动画的元素
    document.querySelectorAll('.scroll-fade, .stat-number, .service-card').forEach(el => {
        observer.observe(el);
    });

    // 数字增长动画
    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-value'));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            element.textContent = Math.floor(current);
        }, 40);
    }

    // 3D 卡片效果
    document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // 浮动客服按钮点击事件
    const supportButton = document.querySelector('.support-button');
    if (supportButton) {
        supportButton.addEventListener('click', () => {
            // 这里添加您的客服系统逻辑
            alert('正在连接客服系统...');
        });
    }

    // 案例点击事件处理
    document.querySelectorAll('.case-item').forEach(item => {
        item.addEventListener('click', () => {
            // 创建模态框背景
            const modal = document.createElement('div');
            modal.className = 'modal-backdrop';
            document.body.appendChild(modal);

            // 创建案例详情容器
            const detail = document.createElement('div');
            detail.className = 'case-detail';
            
            // 获取案例数据
            const title = item.querySelector('h3').textContent;
            const category = item.dataset.category;
            
            // 填充详情内容
            detail.innerHTML = `
                <h3>${title}</h3>
                <p>类别：${category}</p>
                <div class="case-metrics">
                    <div>用户增长：1000%/月</div>
                    <div>完成周期：15天</div>
                    <div>融资金额：5000万</div>
                </div>
                <button class="modal-close">×</button>
            `;
            
            document.body.appendChild(detail);
            
            // 显示详情
            setTimeout(() => {
                detail.style.display = 'block';
            }, 100);

            // 关闭事件
            const closeModal = () => {
                modal.remove();
                detail.remove();
            };

            modal.addEventListener('click', closeModal);
            detail.querySelector('.modal-close').addEventListener('click', closeModal);
        });
    });

    // 初始化合作伙伴卡片交互
    function initPartnerCards() {
        const cards = document.querySelectorAll('.partner-card');
        
        cards.forEach(card => {
            // 添加鼠标进入效果
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => {
                    if (c !== card) {
                        c.style.opacity = '0.6';
                        c.style.transform = 'scale(0.98)';
                    }
                });
            });
            
            // 添加鼠标离开效果
            card.addEventListener('mouseleave', () => {
                cards.forEach(c => {
                    c.style.opacity = '1';
                    c.style.transform = 'scale(1)';
                });
            });

            // 添加点击效果（可选）
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });
        });
    }

    // 在页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        initPartnerCards();
    });
}); 