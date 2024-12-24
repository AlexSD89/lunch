document.addEventListener('DOMContentLoaded', () => {
    const teamCards = document.querySelectorAll('.team-card');
    const expertiseItems = document.querySelectorAll('.expertise-item');
    const collaborationSvg = document.querySelector('.collaboration-lines');
    
    // 初始化专业领域筛选器
    initExpertiseFilters();
    
    // 生成并显示团队协作连接线
    initCollaborationLines();
    
    // 添加卡片悬停效果
    initCardHoverEffects();
});

// 专业领域筛选功能
function initExpertiseFilters() {
    const expertiseItems = document.querySelectorAll('.expertise-item');
    const teamCards = document.querySelectorAll('.team-card');
    
    expertiseItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            
            // 切换筛选器激活状态
            expertiseItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // 高亮显示相关团队成员
            teamCards.forEach(card => {
                const expertise = card.dataset.expertise.split(',');
                if (type === 'all' || expertise.includes(type)) {
                    card.classList.add('highlighted');
                    card.classList.remove('dimmed');
                } else {
                    card.classList.add('dimmed');
                    card.classList.remove('highlighted');
                }
            });
            
            // 更新协作连接线
            updateCollaborationLines(type);
        });
    });
}

// 团队协作连接线
function initCollaborationLines() {
    const svg = document.querySelector('.collaboration-lines');
    clearSvg(svg);
    
    const cards = Array.from(document.querySelectorAll('.team-card'));
    const connections = findCollaborations(cards);
    
    connections.forEach(conn => {
        drawConnection(svg, conn.from, conn.to, conn.types);
    });
}

function findCollaborations(cards) {
    const connections = [];
    
    cards.forEach((card1, i) => {
        cards.slice(i + 1).forEach(card2 => {
            const expertise1 = card1.dataset.expertise.split(',');
            const expertise2 = card2.dataset.expertise.split(',');
            const commonExpertise = expertise1.filter(exp => expertise2.includes(exp));
            
            if (commonExpertise.length > 0) {
                connections.push({
                    from: card1,
                    to: card2,
                    types: commonExpertise
                });
            }
        });
    });
    
    return connections;
}

function drawConnection(svg, fromCard, toCard, types) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const fromRect = fromCard.getBoundingClientRect();
    const toRect = toCard.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    // 计算相对于SVG的坐标
    const x1 = fromRect.left + fromRect.width/2 - svgRect.left;
    const y1 = fromRect.top + fromRect.height/2 - svgRect.top;
    const x2 = toRect.left + toRect.width/2 - svgRect.left;
    const y2 = toRect.top + toRect.height/2 - svgRect.top;
    
    // 优化贝塞尔曲线控制点
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const curvature = Math.min(dx, dy) * 0.5;
    
    // 创建更自然的曲线路径
    const path = `M ${x1} ${y1} 
                  C ${x1} ${y1 + curvature},
                    ${x2} ${y2 - curvature},
                    ${x2} ${y2}`;
    
    line.setAttribute('d', path);
    line.classList.add('connection-line');
    
    // 设置连接线样式
    types.forEach(type => {
        line.classList.add(`connection-${type}`);
    });
    
    // 添加动画效果
    line.style.strokeDasharray = line.getTotalLength();
    line.style.strokeDashoffset = line.getTotalLength();
    
    svg.appendChild(line);
    
    // 触发动画
    requestAnimationFrame(() => {
        line.style.strokeDashoffset = 0;
    });
}

// 卡片悬停效果
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            highlightConnections(card);
        });
        
        card.addEventListener('mouseleave', () => {
            resetConnections();
        });
    });
}

function highlightConnections(card) {
    const expertise = card.dataset.expertise.split(',');
    const cards = document.querySelectorAll('.team-card');
    const lines = document.querySelectorAll('.connection-line');
    
    // 淡化所有卡片和连接线
    cards.forEach(c => c.classList.add('dimmed'));
    lines.forEach(l => l.classList.add('dimmed'));
    
    // 高亮相关卡片和连接线
    cards.forEach(c => {
        const otherExpertise = c.dataset.expertise.split(',');
        const hasCommon = expertise.some(exp => otherExpertise.includes(exp));
        if (hasCommon || c === card) {
            c.classList.remove('dimmed');
            c.classList.add('highlighted');
        }
    });
}

function resetConnections() {
    const cards = document.querySelectorAll('.team-card');
    const lines = document.querySelectorAll('.connection-line');
    
    cards.forEach(c => {
        c.classList.remove('dimmed', 'highlighted');
    });
    
    lines.forEach(l => {
        l.classList.remove('dimmed');
    });
}

// 工具函数
function clearSvg(svg) {
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
}

// 更新协作连接线
function updateCollaborationLines(type) {
    const svg = document.querySelector('.collaboration-lines');
    clearSvg(svg);
    
    if (type === 'all') {
        initCollaborationLines();
        return;
    }
    
    const cards = Array.from(document.querySelectorAll('.team-card'))
        .filter(card => card.dataset.expertise.includes(type));
    
    const connections = findCollaborations(cards);
    connections.forEach(conn => {
        drawConnection(svg, conn.from, conn.to, [type]);
    });
}

// 添加窗口调整事件处理
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initCollaborationLines();
    }, 250);
});

// 添加初始化"全部"筛选器
document.addEventListener('DOMContentLoaded', () => {
    const allFilter = document.createElement('div');
    allFilter.className = 'expertise-item active';
    allFilter.dataset.type = 'all';
    allFilter.innerHTML = `
        <i class="fas fa-th-large"></i>
        <span>全部领域</span>
    `;
    
    const indicators = document.querySelector('.expertise-indicators');
    indicators.insertBefore(allFilter, indicators.firstChild);
});

// 添加卡片展开效果
function initCardExpand() {
    const cards = document.querySelectorAll('.team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // 当前卡片展开时，稍微淡化其他卡片
            cards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // 恢复其他卡片的透明度
            cards.forEach(c => {
                c.style.opacity = '1';
            });
        });
    });
}

// 优化连接线显示
function updateConnectionsOnHover(card) {
    const svg = document.querySelector('.collaboration-lines');
    const cards = document.querySelectorAll('.team-card');
    const expertise = card.dataset.expertise.split(',');
    
    cards.forEach(c => {
        if (c !== card) {
            const otherExpertise = c.dataset.expertise.split(',');
            const hasCommon = expertise.some(exp => otherExpertise.includes(exp));
            
            if (!hasCommon) {
                c.style.opacity = '0.5';
            }
        }
    });
    
    // 高亮相关连接线
    const lines = svg.querySelectorAll('.connection-line');
    lines.forEach(line => {
        const isConnected = expertise.some(exp => line.classList.contains(`connection-${exp}`));
        line.style.opacity = isConnected ? '1' : '0.2';
        if (isConnected) {
            line.style.strokeWidth = '3';
        }
    });
} 