document.addEventListener('DOMContentLoaded', function() {
    let currentTab = 'ott';
    let touchStartX = 0;
    let touchEndX = 0;
    const container = document.querySelector('.card-container');
    
    // 터치 이벤트 리스너
    container.addEventListener('touchstart', handleTouchStart, false);
    container.addEventListener('touchmove', handleTouchMove, false);
    container.addEventListener('touchend', handleTouchEnd, false);
    
    // 마우스 이벤트 리스너
    container.addEventListener('mousedown', handleMouseDown, false);
    container.addEventListener('mousemove', handleMouseMove, false);
    container.addEventListener('mouseup', handleMouseUp, false);
    container.addEventListener('mouseleave', handleMouseUp, false);
    
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        if (!touchStartX) return;
        e.preventDefault();
        touchEndX = e.touches[0].clientX;
    }
    
    function handleTouchEnd() {
        if (!touchStartX || !touchEndX) return;
        
        const diffX = touchStartX - touchEndX;
        const threshold = 50; // 스와이프 감지 임계값
        
        if (Math.abs(diffX) > threshold) {
            // 오른쪽으로 스와이프
            if (diffX > 0) {
                switchToNextTab();
            }
            // 왼쪽으로 스와이프
            else {
                switchToPrevTab();
            }
        }
        
        touchStartX = 0;
        touchEndX = 0;
    }
    
    function handleMouseDown(e) {
        isDragging = true;
        startX = e.pageX;
        scrollLeft = container.scrollLeft;
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const diffX = startX - x;
        container.scrollLeft = scrollLeft + diffX;
    }
    
    function handleMouseUp(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - e.pageX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                switchToNextTab();
            } else {
                switchToPrevTab();
            }
        }
    }
    
    function switchToNextTab() {
        const tabs = ['ott', 'tv', 'streaming'];
        const currentIndex = tabs.indexOf(currentTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        const nextTab = tabs[nextIndex];
        
        updateNavigation(nextTab);
        showCardList(nextTab, 'right');
        currentTab = nextTab;
    }
    
    function switchToPrevTab() {
        const tabs = ['ott', 'tv', 'streaming'];
        const currentIndex = tabs.indexOf(currentTab);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        const prevTab = tabs[prevIndex];
        
        updateNavigation(prevTab);
        showCardList(prevTab, 'left');
        currentTab = prevTab;
    }
    
    function updateNavigation(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.textContent.toLowerCase() === targetId) {
                link.classList.add('active');
            }
        });
    }

    // 기존 카드 클릭 이벤트
    document.querySelectorAll('.card-box').forEach(function(element) {
        element.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                redirectToYoutube(url);
            }
        });
    });

    // 초기 상태 설정
    showCardList('ott', 'right');

    // 네비게이션 클릭 이벤트
    document.querySelectorAll('.nav-link').forEach(function(navLink) {
        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.textContent.toLowerCase();
            const direction = getSlideDirection(currentTab, targetId);
            
            updateNavigation(targetId);
            showCardList(targetId, direction);
            currentTab = targetId;
        });
    });
});

function getSlideDirection(currentTab, newTab) {
    const tabs = ['ott', 'tv', 'streaming'];
    const currentIndex = tabs.indexOf(currentTab);
    const newIndex = tabs.indexOf(newTab);
    
    return newIndex > currentIndex ? 'right' : 'left';
}

function showCardList(targetId, direction) {
    document.querySelectorAll('.card-list').forEach(list => {
        if (list.classList.contains('active')) {
            list.style.transform = `translateX(${direction === 'right' ? '-100%' : '100%'})`;
            list.style.opacity = '0';
            setTimeout(() => {
                list.classList.remove('active');
                list.style.display = 'none';
            }, 500);
        }
    });
    
    const targetList = document.getElementById(targetId);
    if (targetList) {
        targetList.style.display = 'flex';
        targetList.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'})`;
        
        targetList.offsetHeight;
        
        targetList.classList.add('active');
        targetList.style.transform = 'translateX(0)';
        targetList.style.opacity = '1';
    }
}

function redirectToYoutube(url) {
    window.open('http://www.youtube.com/redirect?q=' + url);
}
