let currentDate = new Date(); // 현재 날짜로 초기화
let selectedDateKey = ''; // 선택된 날짜 (형식: YYYY-MM-DD)
let events = {};

try {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) {
        events = JSON.parse(saved) || {};
    }
} catch (e) {
    console.warn('저장된 일정을 불러오는데 실패했습니다.', e);
    events = {};
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('monthDisplay').innerText = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    document.getElementById('yearDisplay').innerText = year;

    // 테마 꽃 정보 업데이트
    const flower = flowers[month];
    document.getElementById('flowerName').innerText = `🌸 ${flower.name}`;
    document.getElementById('flowerMeaning').innerText = `"${flower.meaning}"`;
    document.getElementById('flowerBg').style.backgroundImage = `url('${flower.img}')`;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // 요일 헤더 생성
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const div = document.createElement('div');
        div.className = 'day-name';
        div.innerText = day;
        grid.appendChild(div);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // 빈 날짜(이전 달 영역) 
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = 'day empty';
        grid.appendChild(div);
    }

    // 실제 날짜 렌더링
    for (let i = 1; i <= lastDate; i++) {
        const div = document.createElement('div');
        div.className = 'day';
        
        const dateText = document.createElement('span');
        dateText.innerText = i;
        div.appendChild(dateText);

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // 일정이 있는 날짜에 점(dot) 표시
        if (events[dateKey]) {
            const dot = document.createElement('div');
            dot.className = 'event-dot';
            div.appendChild(dot);
        }

        // 오늘 날짜 강조
        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            div.classList.add('today');
        }

        // 날짜 클릭 이벤트 (일정 추가/확인)
        div.onclick = () => openModal(dateKey, i, month + 1, year);
        grid.appendChild(div);
    }
}

// 월 변경
function changeMonth(diff) {
    currentDate.setMonth(currentDate.getMonth() + diff);
    renderCalendar();
}

// 연도 변경
function changeYear(diff) {
    currentDate.setFullYear(currentDate.getFullYear() + diff);
    renderCalendar();
}

// 일정 관련 모달 UI 열기
function openModal(dateKey, day, month, year) {
    selectedDateKey = dateKey;
    document.getElementById('modalDate').innerText = `${year}년 ${month}월 ${day}일`;
    document.getElementById('eventInput').value = events[dateKey] || '';
    
    document.getElementById('eventModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// 일정 로컬 스토리지에 저장 (빈 값이면 삭제)
function saveEvent() {
    const eventText = document.getElementById('eventInput').value.trim();
    if (eventText) {
        events[selectedDateKey] = eventText;
    } else {
        delete events[selectedDateKey];
    }
    
    // 데이터를 localStorage에 동기화
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    closeModal();
    renderCalendar(); // UI(dot 등) 반영을 위해 다시 렌더링
}

// 모달 바깥 배경 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target == modal) {
        closeModal();
    }
}

// DOM 요소가 모두 로드된 후 달력이 정상 렌더링되게 보장
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});

// defer 속성에 의해 이미 DOM이 로드된 상태일 경우 즉시 실행
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderCalendar();
}
