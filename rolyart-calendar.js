function RolyartCalendar(config){
    this.container = document.getElementById(config.container);
    this.container.classList.add('rolyart-calendar');
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.months = config.months;
    this.weekDays = config.weekDays;
    this.firstDayOfWeek = config.firstDayOfWeek || 0;
    this.daySelection = config.daySelection || 'single';
    this.min = config.min;
    this.max = config.max;

    /** 
     * YYYY-MM-DD date format
     * YYYYmmdd()
     */
    this.YYYYmmdd = (date)=>{
        let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
        day = '0' + day;
        return [year, month, day].join('-');
    }

    /**
     * Selection
     */
    var selected = this.YYYYmmdd(this.today);
    if (this.daySelection === 'toggle') {
        selected = [this.YYYYmmdd(this.today)];
    }
    Object.defineProperty(this, "selected", {
        get() { return selected; },
        set(newValue) { 
            selected = newValue; 
            this.showCalendar(this.currentYear, this.currentYear); 
        },
    });

    /** 
     * Calendar navigation
     * nextMonth()
     * prevMonth()
     */
    this.nextMonth = ()=>{
        if ( this.currentMonth == 11 ) {
            this.currentMonth = 0;
            this.currentYear = this.currentYear + 1;
        }
        else {
            this.currentMonth = this.currentMonth + 1;
        }
        this.showCalendar(this.currentYear, this.currentYear);
    }
    this.prevMonth = ()=>{
        if ( this.currentMonth == 0 ) {
            this.currentMonth = 11;
            this.currentYear = this.currentYear - 1;
        }
        else {
            this.currentMonth = this.currentMonth - 1;
        }
        this.showCalendar(this.currentYear, this.currentYear);
    }
    /** 
     * Get days of month
     * getPrevDays()
     * getNextDays()
     * getCurrentDays()
     */
    this.getPrevDays = (date)=>{
        let ret = [];
        let year = date.getFullYear();
        let month = date.getMonth();
        let firstWeekday =  new Date(year, month, 1).getDay();
        let days = (firstWeekday + 7) - (this.firstDayOfWeek + 7) - 1;
        for (let i=days * -1; i<=0;i++){
            ret.push({date:new Date(year, month, i).getDate(), type:"not-current", id:new Date(year, month, i) });  
        }
        return ret;
    }
    this.getNextDays = (prevMonthDays, monthDays)=>{
        let ret = [];
        let days = 42 - (prevMonthDays.length + monthDays.length);
        for(let i = 1; i<=days; i++){
            ret.push({date:i, type:"not-current"});
        }
        return ret;
    }
    this.getCurrentDays = (date)=>{
        let ret = [];
        let year = date.getFullYear();
        let month = date.getMonth();
        let lastDay = new Date(year, month +1 , 0).getDate();
        for(let i = 1; i<=lastDay;i++){
            ret.push({date:i, type:"current", id:this.YYYYmmdd(new Date(year, month, i)) });
        }
        return ret;
    }

    this.inRange = (date)=>{
        var after = new Date(date);
        after.setHours(12);
        var before = new Date(date);
        before.setDate(date.day - 1);
        before.setHours(12);
        if (this.min) {
            if (new Date(this.min) > after) return false;
        }
        if (this.max) {
            if (new Date(this.max) < before) return false;
        }
        return true;
    }

    this.calendarHeader = ()=>{
        let header = document.createElement('header');
        header.classList.add('calendar-header');
        let monthAndYear = document.createElement('h3');
        let prevMonth = document.createElement('button');
        let currentMonth =  document.createElement('button');
        let nextMonth = document.createElement('button');

        monthAndYear.classList.add('month-year');
        monthAndYear.innerHTML = `${this.months[this.currentMonth] +' '+ this.currentYear}`;
        
        var prevMonthEnabled = true;
        if (this.min) {
            let prevMonthEnd = new Date(this.currentYear, this.currentMonth, 0);
            prevMonthEnd.setHours(12);
            prevMonthEnabled = new Date(this.min) < prevMonthEnd;
        }
        prevMonth.innerHTML = '<i class="arrow prev-month"></i>'
        if (prevMonthEnabled) {
            prevMonth.addEventListener('click', ()=>{
                this.prevMonth();
                monthAndYear.innerHTML = `${this.months[this.currentMonth] +' '+ this.currentYear}`;
            })
        } else {
            prevMonth.disabled = true;
        }

        var nextMonthEnabled = true;
        if (this.max) {
            let monthEnd = new Date(this.currentYear, this.currentMonth + 1, 0);
            monthEnd.setHours(12);
            nextMonthEnabled = new Date(this.max) > monthEnd;
        }
        nextMonth.innerHTML = '<i class="arrow next-month"></i>'
        if (nextMonthEnabled) {
            nextMonth.addEventListener('click', ()=>{
                this.nextMonth(); 
                monthAndYear.innerHTML = `${this.months[this.currentMonth] +' '+ this.currentYear}`;
            })
        } else {
            nextMonth.disabled = true;
        }

        currentMonth.innerHTML = '<i class="current-month"></i>'
        currentMonth.addEventListener('click', ()=>{
            this.currentYear = new Date().getFullYear();
            this.currentMonth = new Date().getMonth();
            monthAndYear.innerHTML = `${this.months[this.currentMonth] +' '+ this.currentYear}`;
            this.showCalendar();
        })

        let weekDays = document.createElement('div');
        weekDays.classList.add('week-days');
        for(let i = 0; i<=6;i++) {
            let day = this.weekDays[(i + this.firstDayOfWeek) % 7];
            weekDays.innerHTML +=`<div>${day}</div>`;
        }

        header.appendChild(monthAndYear)
        header.appendChild(prevMonth);
        header.appendChild(currentMonth);
        header.appendChild(nextMonth);
        this.container.appendChild(header);
        this.container.appendChild(weekDays);
    }

    this.selectedDays = () => {
        if (typeof this.selected === 'string') {
            return [this.selected];
        } else if (this.selected instanceof Array) {
            return this.selected;
        } else {
            return [];
        }
    }
    
    this.calendarBody = (year, month)=>{
        year = this.currentYear;
        month = this.currentMonth;
        let date = new Date(year, month+1, 0);
        let daysPrevMonth = this.getPrevDays(date);
        let daysThisMonth = this.getCurrentDays(date);
        let daysNextMonth = this.getNextDays(daysPrevMonth, daysThisMonth);
        let calendarBody = document.createElement('div');
        calendarBody.classList.add('calendar-body');
        let selectedDays = this.selectedDays();
        [...daysPrevMonth, ...daysThisMonth, ...daysNextMonth]
        .forEach(num=>{
            let cell = document.createElement('div');
            cell.setAttribute('id', num.id);
            cell.classList.add('day');
            let day = document.createElement('span');
            
            day.innerHTML = num.date;
            cell.appendChild(day);
            cell.addEventListener('click', ()=>{
                if (!this.inRange(num.id)) return false;
                if (this.daySelection === 'single') {
                    this.selected = num.id;
                } else if (this.daySelection === 'toggle') {
                    let selectedDays = this.selectedDays();
                    let index = selectedDays.indexOf(num.id);
                    if (index == -1) {
                        selectedDays.push(num.id);
                    } else {
                        selectedDays.splice(index, 1);
                    }
                    this.selected = selectedDays;
                } else if (this.daySelection instanceof Function) {
                    this.daySelection(num.id);
                }
            });
            num.type === 'not-current'?cell.classList.add('not-current'):cell.classList.add('current');
            if(num.id === this.YYYYmmdd(this.today)){
                cell.classList.add('active');
            }
            if (selectedDays.indexOf(num.id) > -1) {
                cell.classList.add('selected');
            }
            calendarBody.appendChild(cell);
        })
        this.container.appendChild(calendarBody);
    }

    this.showCalendar = (year, month)=>{
        this.container.innerHTML = '';
        this.calendarHeader();
        this.calendarBody(year, month);
    }

    this.showCalendar(this.currentYear, this.currentMonth);
}


