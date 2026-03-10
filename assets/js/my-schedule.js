/**
 * MyScheduleManager
 * Handles calendar rendering and basic schedule interactions
 */

const MyScheduleManager = (() => {
  let calendar = null;
  let events = [];
  let activeEventId = null;

  const STORAGE_KEY = 'scholarkit_my_schedule_events';

  /**
   * @typedef {Object} ScheduleEvent
   * @property {string} id
   * @property {string} title
   * @property {string} type - exam | lecture | event | holiday | other
   * @property {string} date - YYYY-MM-DD
   * @property {string} [time]
   * @property {boolean} [starred]
   * @property {string} [notes]
   */

  /**
   * Load events from localStorage
   * @returns {ScheduleEvent[]}
   */
  const loadEvents = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.error('MyScheduleManager: Failed to load events', err);
      return [];
    }
  };

  /**
   * Save events to localStorage
   * @param {ScheduleEvent[]} list
   */
  const saveEvents = (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('MyScheduleManager: Failed to save events', err);
    }
  };

  /**
   * Map internal events to FullCalendar event objects
   */
  const getCalendarEvents = () => {
    return events.map((ev) => ({
      id: ev.id,
      title: ev.title,
      start: ev.date,
      allDay: true,
    }));
  };

  /**
   * Initialize calendar with a basic month view
   */
  const initCalendar = () => {
    const calendarEl = document.getElementById('scheduleCalendar');
    if (!calendarEl || !window.FullCalendar) {
      console.warn('MyScheduleManager: Calendar element or FullCalendar not available yet.');
      return;
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: '',
      },
      height: 'auto',
      events: getCalendarEvents(),
      dateClick: (info) => {
        openAddModal(info.dateStr);
      },
      eventClick: (info) => {
        openEditModal(info.event.id);
      },
    });

    calendar.render();
  };

  /**
   * Refresh calendar event source from in-memory events
   */
  const refreshCalendarEvents = () => {
    if (!calendar) return;
    calendar.removeAllEvents();
    getCalendarEvents().forEach((fcEvent) => {
      calendar.addEvent(fcEvent);
    });
  };

  /**
   * Public init: load events, init calendar, render today card
   */
  const init = () => {
    events = loadEvents();
    initCalendar();
    renderTodayEvents();
  };

  /**
   * Validate that a date is today or in the future
   * @param {string} dateStr - YYYY-MM-DD
   * @returns {boolean}
   */
  const isFutureOrToday = (dateStr) => {
    const today = new Date();
    const todayYmd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    const [year, month, day] = dateStr.split('-').map((v) => parseInt(v, 10));
    const target = new Date(year, month - 1, day).getTime();
    return target >= todayYmd;
  };

  /**
   * Open modal to add a new event on given date
   * @param {string} dateStr - YYYY-MM-DD
   */
  const openAddModal = (dateStr) => {
    activeEventId = null;
    const modal = document.getElementById('scheduleEventModal');
    const titleEl = document.getElementById('scheduleEventModalTitle');
    const deleteBtn = document.getElementById('scheduleEventDeleteBtn');

    if (!modal || !titleEl) return;

    titleEl.textContent = 'Add Event';
    deleteBtn.style.display = 'none';

    const form = document.getElementById('scheduleEventForm');
    if (form) {
      form.reset();
    }

    const dateInput = document.getElementById('scheduleEventDate');
    if (dateInput) {
      dateInput.value = dateStr;
      dateInput.min = getTodayDateString();
    }

    modal.classList.add('show');
  };

  /**
   * Open modal to edit an existing event
   * @param {string} eventId
   */
  const openEditModal = (eventId) => {
    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    activeEventId = eventId;
    const modal = document.getElementById('scheduleEventModal');
    const titleEl = document.getElementById('scheduleEventModalTitle');
    const deleteBtn = document.getElementById('scheduleEventDeleteBtn');

    if (!modal || !titleEl) return;

    titleEl.textContent = 'Edit Event';
    deleteBtn.style.display = 'inline-flex';

    document.getElementById('scheduleEventId').value = event.id;
    document.getElementById('scheduleEventTitle').value = event.title || '';
    document.getElementById('scheduleEventType').value = event.type || 'other';
    const dateInput = document.getElementById('scheduleEventDate');
    if (dateInput) {
      dateInput.value = event.date;
      dateInput.min = getTodayDateString();
    }
    document.getElementById('scheduleEventTime').value = event.time || '';
    document.getElementById('scheduleEventNotes').value = event.notes || '';
    document.getElementById('scheduleEventStarred').checked = !!event.starred;

    modal.classList.add('show');
  };

  /**
   * Close event modal
   */
  const closeEventModal = () => {
    const modal = document.getElementById('scheduleEventModal');
    if (modal) {
      modal.classList.remove('show');
    }
    activeEventId = null;
  };

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  /**
   * Submit add/edit event form
   */
  const submitEventForm = () => {
    const form = document.getElementById('scheduleEventForm');
    if (!form) return;

    const formData = new FormData(form);
    const title = (formData.get('title') || '').toString().trim();
    const type = (formData.get('type') || 'other').toString();
    const date = (formData.get('date') || '').toString();
    const time = (formData.get('time') || '').toString().trim();
    const notes = (formData.get('notes') || '').toString().trim();
    const starred = formData.get('starred') === 'on';

    if (!title || !date) {
      DialogManager.showAlert('Invalid event', 'Title and date are required.');
      return;
    }

    if (!isFutureOrToday(date)) {
      DialogManager.showAlert(
        'Invalid date',
        'You can only schedule events for today or the future.'
      );
      return;
    }

    if (activeEventId) {
      // Edit existing
      events = events.map((ev) =>
        ev.id === activeEventId
          ? { ...ev, title, type, date, time, notes, starred }
          : ev
      );
    } else {
      // Add new
      const newEvent = {
        id: Date.now().toString(),
        title,
        type,
        date,
        time,
        notes,
        starred,
      };
      events.push(newEvent);
    }

    saveEvents(events);
    refreshCalendarEvents();
    renderTodayEvents();
    closeEventModal();
  };

  /**
   * Ask for delete confirmation on active event
   */
  const requestDeleteActiveEvent = () => {
    if (!activeEventId) {
      closeEventModal();
      return;
    }

    DialogManager.showConfirm(
      'Delete event',
      'Are you sure you want to delete this event?',
      (confirmed) => {
        if (!confirmed) return;
        events = events.filter((ev) => ev.id !== activeEventId);
        saveEvents(events);
        refreshCalendarEvents();
        renderTodayEvents();
        closeEventModal();
      }
    );
  };

  /**
   * Render today's events into the side card
   */
  const renderTodayEvents = () => {
    const listEl = document.getElementById('todayEventsList');
    if (!listEl) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const todaysEvents = events.filter((ev) => ev.date === todayStr);

    listEl.innerHTML = '';

    if (!todaysEvents.length) {
      const empty = document.createElement('p');
      empty.className = 'today-events-empty';
      empty.textContent = 'No events scheduled for today.';
      listEl.appendChild(empty);
      return;
    }

    todaysEvents
      .sort((a, b) => {
        // Starred first
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        return a.title.localeCompare(b.title);
      })
      .forEach((ev) => {
        const item = document.createElement('div');
        item.className = 'today-event-item';

        const header = document.createElement('div');
        header.className = 'today-event-header';

        const title = document.createElement('span');
        title.className = 'today-event-title';
        title.textContent = ev.title;

        header.appendChild(title);

        if (ev.starred) {
          const star = document.createElement('span');
          star.className = 'today-event-star';
          star.textContent = '★';
          header.appendChild(star);
        }

        const meta = document.createElement('div');
        meta.className = 'today-event-meta';
        const typeLabel = document.createElement('span');
        typeLabel.className = `today-event-type today-event-type-${ev.type || 'other'}`;
        typeLabel.textContent = (ev.type || 'other').toUpperCase();

        meta.appendChild(typeLabel);

        if (ev.time) {
          const timeSpan = document.createElement('span');
          timeSpan.className = 'today-event-time';
          timeSpan.textContent = ev.time;
          meta.appendChild(timeSpan);
        }

        item.appendChild(header);
        item.appendChild(meta);

        if (ev.notes) {
          const notes = document.createElement('p');
          notes.className = 'today-event-notes';
          notes.textContent = ev.notes;
          item.appendChild(notes);
        }

        listEl.appendChild(item);
      });
  };

  return {
    init,
    loadEvents,
    saveEvents,
    renderTodayEvents,
    refreshCalendarEvents,
    openAddModal,
    openEditModal,
    closeEventModal,
    submitEventForm,
    requestDeleteActiveEvent,
  };
})();


