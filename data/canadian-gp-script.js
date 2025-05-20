let db;

async function init() {
  const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });
  db = new SQL.Database();

  // Schema using agreed upon business vocabulary
  db.run(`CREATE TABLE GuestType(id TEXT PRIMARY KEY, name TEXT, options TEXT);`);
  db.run(`CREATE TABLE TicketType(id TEXT PRIMARY KEY, name TEXT, capacity INTEGER NOT NULL DEFAULT 0, remainingCapacity INTEGER NOT NULL DEFAULT 0);`);
  db.run(`CREATE TABLE TicketValidity(ticketTypeId TEXT, date TEXT, FOREIGN KEY(ticketTypeId) REFERENCES TicketType(id));`);
  db.run(`CREATE TABLE StandardActivity(id INTEGER PRIMARY KEY AUTOINCREMENT, dateTime TEXT, description TEXT);`);
  db.run(`CREATE TABLE Experience(id TEXT PRIMARY KEY, name TEXT, dateTime TEXT, description TEXT);`);
  db.run(`CREATE TABLE Invitation(
            id TEXT PRIMARY KEY, name TEXT, email TEXT,
            ticketTypeId TEXT, guestTypeId TEXT, primaryGuestId TEXT, 
            options TEXT 
          );`);
  db.run(`CREATE TABLE GuestType_Experience(guestTypeId TEXT, experienceId TEXT, PRIMARY KEY (guestTypeId, experienceId));`);
  db.run(`CREATE TABLE Invitation_Experience(invitationId TEXT, experienceId TEXT, PRIMARY KEY (invitationId, experienceId));`);

  // Seed Data (Updated to be as similar to index2.html's data philosophy as possible)
  
  // GuestType data
  db.run(`INSERT INTO GuestType VALUES 
    ('guestType01','VIP','request_accommodation,request_transport'), 
    ('guestType02','General',''), 
    ('guestType03','+1','plus_1');`);

  // TicketType: IDs from index.html, names/capacities inspired by index2.html where mapped.
  // Remaining capacity calculated based on the invitations below.
  db.run(`INSERT INTO TicketType (id, name, capacity, remainingCapacity) VALUES 
  ('ticket01','3-Day Pass (13–15 June)', 100, 98), 
  ('ticket02','Day 2 Pass (14 June)', 50, 49),
  ('ticket03','Day 3 Pass (15 June)', 75, 75);`);

  db.run(`INSERT INTO TicketValidity VALUES 
  ('ticket01','2025-06-13'), ('ticket01','2025-06-14'), ('ticket01','2025-06-15'),
  ('ticket02','2025-06-14'), 
  ('ticket03','2025-06-15');`);
  
  // StandardActivity INSERT (Kept from original index.html as it's comprehensive)
  const standardActivityInserts = [
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T09:00','Circuit Gates Open');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T10:00','Porsche Carrera Cup North America - First Practice Session');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T11:05','F1 Academy - Practice Session');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T12:00','FIA - F1 Car Presentation');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T12:00','Paddock Club - Pit Lane Walk');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T12:00','Paddock Club - Track Tour');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T13:30','Formula 1 - First Practice Session (FP1)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T15:00','Porsche Carrera Cup North America - Second Practice Session');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T15:30','Formula 1 - Teams'' Press Conference');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T15:40','Paddock Club - Track Tour');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T15:40','Paddock Club - Pit Lane Walk');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T17:00','Formula 1 - Second Practice Session (FP2)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T18:30','F1 Academy - Qualifying Session');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T19:15','F1 Experiences - Track Tour & Photo');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-13T20:00','F1 Experiences - Pit Lane Walk (General)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T09:00','Circuit Gates Open');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T09:15','F1 Academy - First Race');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T10:25','Porsche Carrera Cup North America - Qualifying Session');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T11:15','Formula 1 - Team Pit Stop Practice');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T11:15','Paddock Club - Track Tour');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T11:15','Paddock Club - Pit Lane Walk');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T12:30','Formula 1 - Third Practice Session (FP3)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T13:40','Paddock Club - Track Tour');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T13:40','Paddock Club - Pit Lane Walk');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T14:50','F1 Academy - Second Race');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T16:00','Formula 1 - Qualifying Session (Q1, Q2, Q3)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T17:00','Formula 1 - Post-Qualifying Press Conference');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T18:00','Porsche Carrera Cup North America - Race');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-14T19:00','F1 Experiences - Grid Walk & Photo (General)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T08:30','Circuit Gates Open');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T09:25','Porsche Carrera Cup North America - Race');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T10:55','F1 Academy - Third Race');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T11:55','Paddock Club - Pit Lane Walk');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T11:55','Paddock Club - Track Tour');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T12:00','Formula 1 - Drivers'' Parade');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T13:44','Formula 1 - National Anthem');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T14:00','Formula 1 - Canadian Grand Prix (Race Start)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T16:00','Formula 1 - Podium Ceremony (estimated)');",
    "INSERT INTO StandardActivity (dateTime, description) VALUES ('2025-06-15T16:30','Formula 1 - Post-Race Press Conference (estimated)');"
  ];
  standardActivityInserts.forEach(sql => db.run(sql));

  // Experience INSERT (Kept from original index.html)
  db.run(`INSERT INTO Experience VALUES 
    ('exp01','Meet & Greet with Drivers','2025-06-13T12:30','Exclusive autograph and photo session with selected F1 drivers'),
    ('exp02','Paddock Club Tour','2025-06-13T15:40','Guided tour through the exclusive F1 Paddock Club facilities'),
    ('exp03','VIP Pit Lane Walk','2025-06-13T20:00','Exclusive pit lane access for VIP guests with team personnel'),
    ('exp04','Hydrotherapy for +1','2025-06-14T09:15','Relaxing hydrotherapy session at the circuit spa facility'),
    ('exp05','VIP Paddock Club Lunch','2025-06-14T13:00','Gourmet lunch prepared by celebrity chef in the Paddock Club'),
    ('exp06','Team Photo Session','2025-06-14T14:00','Photo opportunity with team members and car'),
    ('exp07','General Grid Walk','2025-06-15T12:05','Pre-race grid access for selected guests'),
    ('exp08','Rooftop Brunch VIP','2025-06-15T09:00','Exclusive breakfast with panoramic circuit views'),
    ('exp09','Guest +1 Morning Coffee','2025-06-15T10:00','Special coffee morning for companion guests');`);

  
  // GuestType_Experience: Added ('gt_gen', 'exp_paddock_tour') for similarity with index2.html logic.
  db.run(`INSERT INTO GuestType_Experience VALUES 
    ('guestType01', 'exp01'), 
    ('guestType01', 'exp03'),
    ('guestType01', 'exp05'),
    ('guestType01', 'exp08'),
    ('guestType02', 'exp02'), 
    ('guestType02', 'exp06'),
    ('guestType02', 'exp07'),
    ('guestType03', 'exp04'),
    ('guestType03', 'exp09');`);  
  
  // Invitation Data: Alice, Bob, Charlie updated for index2.html similarity. Others kept from original index.html.
  db.run(`INSERT INTO Invitation (id, name, email, ticketTypeId, guestTypeId, options, primaryGuestId) VALUES 
    ('guest01','Alice Freeman','alice@ukfans.com','ticket01','guestType01', 'request_accommodation:Four Seasons,request_transport:Helicopter', NULL), 
    ('guest02','Bob Wang','bob@asiafans.com','ticket02','guestType02', NULL, NULL),
    ('guest03','Charlie Guest','charlie@ukfans.com','ticket01','guestType03', 'plus_1', 'guest01');`);
  
  // Adding additional direct experiences to specific invitations (Kept from original index.html)
  db.run(`INSERT INTO Invitation_Experience VALUES 
    ('guest02', 'exp02'), 
    ('guest01', 'exp05');`);

  renderAllDropdowns();
  renderTicketCapacitySummary();
  renderInvitationSelect();
  const initialInvitationId = document.getElementById('invitationSelect').value;
  if (initialInvitationId) {
    renderGuestUI(initialInvitationId);
  }
}

function renderAllDropdowns(){
    renderDropdown('newInvitationTicketTypeId', 'TicketType', true, null, 'remainingCapacity');
    renderDropdown('newInvitationGuestTypeId', 'GuestType', true);
    renderDropdown('assignExpGuestType', 'GuestType', false); // No empty option needed here
    renderDropdown('assignExpExperience', 'Experience', false); // No empty option needed here
    renderAvailableExperiencesForInvitationCheckboxes(); 
}

function renderTicketCapacitySummary() {
    const summaryDiv = document.getElementById('ticketCapacitySummary');
    summaryDiv.innerHTML = ''; // Clear previous
    let html = '<h3>Ticket Capacity Overview</h3>'; 
    const stmt = db.prepare("SELECT id, name, capacity, remainingCapacity FROM TicketType ORDER BY name");
    let ticketData = [];
    while(stmt.step()) ticketData.push(stmt.getAsObject());
    stmt.free();

    if (ticketData.length === 0) {
        html += '<p>No ticket types defined yet.</p>';
    } else {
        html += `<table><thead><tr><th>ID</th><th>Ticket Name</th><th>Total</th><th>Remaining</th></tr></thead><tbody>`;
        ticketData.forEach(ticket => {
        html += `<tr><td>${ticket.id}</td><td>${ticket.name}</td><td>${ticket.capacity}</td><td>${ticket.remainingCapacity}</td></tr>`;
        });
        html += '</tbody></table>';
    }
    summaryDiv.innerHTML = html;
}

function renderDropdown(elementId, tableName, includeEmpty=true, valueFormatter = null, displayExtraField = null) {
  let rows = [];
  let query = `SELECT id, name ${displayExtraField ? `, ${displayExtraField}` : ''} FROM ${tableName} ORDER BY name`;
  let stmt = db.prepare(query);
  while(stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  let opts = includeEmpty ? `<option value="">-- Select ${tableName.replace(/([A-Z])/g, ' $1').trim()} --</option>` : '';
  opts += rows.map(r => {
    const val = valueFormatter ? valueFormatter(r.id, r.name) : r.id;
    let displayName = r.name;
    if (tableName === 'TicketType' && displayExtraField && typeof r[displayExtraField] === 'number') {
      displayName += ` (Avail: ${r[displayExtraField]})`;
    }
    return `<option value="${val}">${displayName} (ID: ${r.id})</option>`;
  }).join('');
  document.getElementById(elementId).innerHTML = opts;
}

function renderInvitationSelect() {
  const res = db.exec("SELECT id, name, guestTypeId FROM Invitation ORDER BY name");
  const selectEl = document.getElementById('invitationSelect');
  selectEl.innerHTML = ''; // Clear
  if (res.length > 0 && res[0].values.length > 0) {
    let optionsHtml = '<option value="">-- Select Guest --</option>';
    optionsHtml += res[0].values.map(([id,name,gtId])=>`<option value="${id}">${name} (Guest Type: ${gtId})</option>`).join('');
    selectEl.innerHTML = optionsHtml;
    selectEl.onchange = e => renderGuestUI(e.target.value);
  } else {
    selectEl.innerHTML = '<option value="">No Invitations Yet</option>';
    selectEl.onchange = null;
    document.getElementById('guestDetails').innerHTML = '';
    document.getElementById('standardActivitySchedule').innerHTML = '';
    document.getElementById('additionalExperienceItinerary').innerHTML = '';
  }
}

function renderGuestTypeOptionsForInvitation(guestTypeId, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (!guestTypeId) { container.innerHTML = "<small>Select a Guest Type to see available perks.</small>"; return; }

  const guestTypeRes = db.prepare("SELECT options FROM GuestType WHERE id = ?");
  guestTypeRes.bind([guestTypeId]);
  let optionsString = "";
  if (guestTypeRes.step()) optionsString = guestTypeRes.getAsObject().options;
  guestTypeRes.free();

  if (!optionsString) { container.innerHTML = "<small>No specific configurable perks for this Guest Type.</small>"; return; }

  const optionsArray = optionsString.split(',').filter(Boolean);
  if (optionsArray.length === 0) { container.innerHTML = "<small>No specific configurable perks for this Guest Type.</small>"; return; }
  
  let html = '<h4>Available Perks:</h4>';
  optionsArray.forEach(optKey => {
    const label = optKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    // Use a unique ID for each input field to avoid conflicts if this function is called multiple times for different forms
    const inputId = `inv_opt_${containerId}_${optKey}`; 
    html += `
      <div>
        <label for="${inputId}">${label}:</label>
        <input type="text" id="${inputId}" name="opt_${optKey}" data-option-key="${optKey}" placeholder="Enter details for ${label.toLowerCase()}" />
      </div>
    `;
  });
  container.innerHTML = html;
}

function handleNewInvitationGuestTypeChange(guestTypeId) {
    renderGuestTypeOptionsForInvitation(guestTypeId, 'newInvitationGuestTypeOptionsContainer');
    renderAvailableExperiencesForInvitationCheckboxes(); // Re-render experiences based on new guest type
}

function renderAvailableExperiencesForInvitationCheckboxes() {
    const container = document.getElementById('newInvitationAdditionalExperiences');
    container.innerHTML = ''; // Clear previous checkboxes

    const selectedGuestTypeId = document.getElementById('newInvitationGuestTypeId').value;
    let guestTypeExperienceIds = [];

    if (selectedGuestTypeId) {
        try {
            const guestTypeExpStmt = db.prepare("SELECT experienceId FROM GuestType_Experience WHERE guestTypeId = ?");
            guestTypeExpStmt.bind([selectedGuestTypeId]);
            while (guestTypeExpStmt.step()) {
                guestTypeExperienceIds.push(guestTypeExpStmt.getAsObject().experienceId);
            }
            guestTypeExpStmt.free();
        } catch (e) {
            console.error("Error fetching guest type experiences:", e);
            // Proceed without filtering if there's an error, or handle as appropriate
        }
    }

    const allExperiencesRes = db.exec("SELECT id, name, dateTime FROM Experience ORDER BY dateTime, name");
    if (!allExperiencesRes.length || !allExperiencesRes[0].values.length) {
        container.innerHTML = "<small>No additional experiences available to assign.</small>";
        return;
    }

    let html = '';
    let displayedCount = 0;
    allExperiencesRes[0].values.forEach(([id, name, dateTime]) => {
        // Only display the experience if it's NOT already part of the selected Guest Type's package
        if (!guestTypeExperienceIds.includes(id)) {
            const formattedDateTime = new Date(dateTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            html += `
                <div>
                    <input type="checkbox" id="exp_assign_${id}" name="additionalExperience" value="${id}">
                    <label for="exp_assign_${id}">${name} (${formattedDateTime})</label>
                </div>
            `;
            displayedCount++;
        }
    });

    if (displayedCount === 0) {
        container.innerHTML = "<small>No additional experiences available (or all are part of the selected Guest Type).</small>";
    } else {
        container.innerHTML = html;
    }
}

function renderGuestUI(invitationId) {
  if (!invitationId) {
    document.getElementById('guestDetails').innerHTML = '<p>Please select a guest to see their itinerary.</p>';
    document.getElementById('standardActivitySchedule').innerHTML = '';
    document.getElementById('additionalExperienceItinerary').innerHTML = '';
    return;
  }

  const guestStmt = db.prepare(`
    SELECT inv.name AS guestName, inv.email AS guestEmail, inv.options AS guestOptions,
           tt.name AS ticketTypeName, tt.id AS ticketTypeId,
           gt.name AS guestTypeName, gt.id AS guestTypeId,
           pg.name AS primaryGuestName
    FROM Invitation inv
    JOIN TicketType tt ON inv.ticketTypeId = tt.id
    JOIN GuestType gt ON inv.guestTypeId = gt.id
    LEFT JOIN Invitation pg ON inv.primaryGuestId = pg.id
    WHERE inv.id = ?
  `);
  guestStmt.bind([invitationId]);

  if (!guestStmt.step()) {
    guestStmt.free();
    document.getElementById('guestDetails').innerHTML = `<p>Details for invitation ID '${invitationId}' not found.</p>`;
    document.getElementById('standardActivitySchedule').innerHTML = '';
    document.getElementById('additionalExperienceItinerary').innerHTML = '';
    return;
  }
  const details = guestStmt.getAsObject();
  guestStmt.free();

  let perksListItems = [];

  // 1. Add perks from the Invitation.options string
  if (details.guestOptions) {
    details.guestOptions.split(',')
      .filter(Boolean) // Ensure empty strings from split are ignored
      .forEach(opt => {
        const [key, ...valParts] = opt.split(':');
        const val = valParts.join(':');
        perksListItems.push(`<li>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${val || '<i>Not specified</i>'}</li>`);
      });
  }

  // 2. Add directly assigned experiences
  const directExpStmt = db.prepare(`
    SELECT E.name AS experienceName, E.dateTime AS experienceDateTime
    FROM Experience E
    JOIN Invitation_Experience IE ON E.id = IE.experienceId
    WHERE IE.invitationId = ?
    ORDER BY E.dateTime
  `);
  directExpStmt.bind([invitationId]);
  let hasDirectExperiences = false;
  while(directExpStmt.step()) {
    if (!hasDirectExperiences) { // Add a sub-header if there are direct experiences and other perks
        if (perksListItems.length > 0) {
             perksListItems.push(`<li><strong>Additional Assigned Experiences:</strong></li>`);
        }
        hasDirectExperiences = true;
    }
    const exp = directExpStmt.getAsObject();
    const formattedDateTime = new Date(exp.experienceDateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
    perksListItems.push(`<li>- ${exp.experienceName} (${formattedDateTime})</li>`);
  }
  directExpStmt.free();

  let optionsHtml = '';
  if (perksListItems.length > 0) {
    optionsHtml = `<ul>${perksListItems.join('')}</ul>`;
  } else {
    optionsHtml = "<p>No specific perks or additional experiences recorded for this invitation.</p>";
  }
  
  document.getElementById('guestDetails').innerHTML = `
    <h3>Guest Details</h3>
    <p><strong>Name:</strong> ${details.guestName}</p>
    <p><strong>Email:</strong> ${details.guestEmail || 'N/A'}</p>
    <p><strong>Ticket Type:</strong> ${details.ticketTypeName} (ID: ${details.ticketTypeId})</p>
    <p><strong>Guest Type:</strong> ${details.guestTypeName} (ID: ${details.guestTypeId})</p>
    ${details.primaryGuestName ? `<p><strong>Accompanies:</strong> ${details.primaryGuestName}</p>` : ''}
    <p><strong>Selected Perks/Options:</strong></p>
    ${optionsHtml}
  `;

  renderStandardScheduleForGuest(invitationId, details.ticketTypeId);
  renderExperienceItineraryForGuest(invitationId, details.guestTypeId); // This still shows the full combined itinerary
}

function renderStandardScheduleForGuest(invitationId, ticketTypeId) {
  const scheduleDiv = document.getElementById('standardActivitySchedule');
  const validDatesStmt = db.prepare("SELECT date FROM TicketValidity WHERE ticketTypeId = ?");
  validDatesStmt.bind([ticketTypeId]);
  const validDates = [];
  while(validDatesStmt.step()) validDates.push(validDatesStmt.getAsObject().date);
  validDatesStmt.free();

  if (validDates.length === 0) {
    scheduleDiv.innerHTML = '<h3>Standard Grand Prix Schedule</h3><p>No valid dates found for this guest\'s ticket type.</p>';
    return;
  }
  
  const activitiesStmt = db.prepare("SELECT dateTime, description FROM StandardActivity ORDER BY dateTime");
  let html = '<h3>Standard Grand Prix Schedule</h3>';
  let tableContent = '';
  while(activitiesStmt.step()) {
    const activity = activitiesStmt.getAsObject();
    const activityDate = activity.dateTime.substring(0, 10); // YYYY-MM-DD
    if (validDates.includes(activityDate)) {
      tableContent += `<tr><td>${new Date(activity.dateTime).toLocaleString()}</td><td>${activity.description}</td></tr>`;
    }
  }
  activitiesStmt.free();

  if (tableContent === '') {
    html += '<p>No standard activities scheduled for the valid days of this guest\'s ticket.</p>';
  } else {
    html += `<table><thead><tr><th>Date & Time</th><th>Activity</th></tr></thead><tbody>${tableContent}</tbody></table>`;
  }
  scheduleDiv.innerHTML = html;
}

function renderExperienceItineraryForGuest(invitationId, guestTypeId) {
  const itineraryDiv = document.getElementById('additionalExperienceItinerary');
  // Get experiences assigned via GuestType
  const guestTypeExpStmt = db.prepare(`
    SELECT E.id, E.name, E.dateTime, E.description
    FROM Experience E
    JOIN GuestType_Experience GTE ON E.id = GTE.experienceId
    WHERE GTE.guestTypeId = ?
  `);
  guestTypeExpStmt.bind([guestTypeId]);
  const experiences = {}; // Use object to avoid duplicates by ID
  while(guestTypeExpStmt.step()) {
    const exp = guestTypeExpStmt.getAsObject();
    experiences[exp.id] = exp;
  }
  guestTypeExpStmt.free();

  // Get experiences assigned directly to the Invitation
  const directExpStmt = db.prepare(`
    SELECT E.id, E.name, E.dateTime, E.description
    FROM Experience E
    JOIN Invitation_Experience IE ON E.id = IE.experienceId
    WHERE IE.invitationId = ?
  `);
  directExpStmt.bind([invitationId]);
  while(directExpStmt.step()) {
    const exp = directExpStmt.getAsObject();
    experiences[exp.id] = exp; // Add/overwrite if directly assigned
  }
  directExpStmt.free();
  
  // Get ticket validity dates to filter experiences
  const ticketTypeIdStmt = db.prepare("SELECT ticketTypeId FROM Invitation WHERE id = ?");
  ticketTypeIdStmt.bind([invitationId]);
  let ticketTypeId = null;
  if(ticketTypeIdStmt.step()) ticketTypeId = ticketTypeIdStmt.getAsObject().ticketTypeId;
  ticketTypeIdStmt.free();

  const validDates = [];
  if(ticketTypeId){
    const validDatesStmt = db.prepare("SELECT date FROM TicketValidity WHERE ticketTypeId = ?");
    validDatesStmt.bind([ticketTypeId]);
    while(validDatesStmt.step()) validDates.push(validDatesStmt.getAsObject().date);
    validDatesStmt.free();
  }

  let html = '<h3>Exclusive Experiences Itinerary</h3>';
  const sortedExperiences = Object.values(experiences).sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));
  
  let tableContent = '';
  sortedExperiences.forEach(exp => {
    const expDate = exp.dateTime.substring(0,10);
    if(validDates.includes(expDate)){ // Only show experiences on valid ticket days
        tableContent += `
        <tr>
            <td>${new Date(exp.dateTime).toLocaleString()}</td>
            <td>${exp.name}</td>
            <td>${exp.description || 'N/A'}</td>
        </tr>`;
    }
  });

  if (tableContent === '') {
    html += '<p>No exclusive experiences scheduled for this guest on their valid ticket days, or none assigned.</p>';
  } else {
    html += `<table><thead><tr><th>Date & Time</th><th>Experience</th><th>Details</th></tr></thead><tbody>${tableContent}</tbody></table>`;
  }
  itineraryDiv.innerHTML = html;
}

function addTicketType() {
  const id = document.getElementById('newTicketTypeId').value.trim();
  const name = document.getElementById('newTicketTypeName').value.trim();
  const datesStr = document.getElementById('newTicketTypeDates').value.trim();
  const capacityVal = document.getElementById('newTicketTypeCapacity').value;

  if (!id || !name || !datesStr || !capacityVal) {
    alert("All fields are required for a new ticket type.");
    return;
  }
  const dates = datesStr.split(',').map(d => d.trim()).filter(Boolean);
  if (dates.length === 0) {
    alert("Please provide at least one valid date (YYYY-MM-DD).");
    return;
  }
  const capacity = parseInt(capacityVal, 10);
  if (isNaN(capacity) || capacity < 0) {
    alert("Capacity must be a non-negative number.");
    return;
  }

  try {
    // Check if ticket type ID already exists
    const checkStmt = db.prepare("SELECT COUNT(*) AS count FROM TicketType WHERE id = ?");
    checkStmt.bind([id]);
    checkStmt.step();
    const { count } = checkStmt.getAsObject();
    checkStmt.free();
    if (count > 0) {
        alert(`Ticket Type ID "${id}" already exists. Please use a unique ID.`);
        return;
    }

    db.run("INSERT INTO TicketType (id, name, capacity, remainingCapacity) VALUES (?, ?, ?, ?)", [id, name, capacity, capacity]);
    const stmt = db.prepare("INSERT INTO TicketValidity (ticketTypeId, date) VALUES (?, ?)");
    dates.forEach(date => {
      // Basic date validation (YYYY-MM-DD format)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`Invalid date format: ${date}. Please use YYYY-MM-DD.`);
      }
      stmt.run([id, date]);
    });
    stmt.free();
    alert(`Ticket Type "${name}" added successfully!`);
    renderAllDropdowns();
    renderTicketCapacitySummary();
    // Clear fields
    document.getElementById('newTicketTypeId').value = '';
    document.getElementById('newTicketTypeName').value = '';
    document.getElementById('newTicketTypeDates').value = '';
    document.getElementById('newTicketTypeCapacity').value = '';
    document.getElementById('ticketTypeTemplateSelect').value = '';
  } catch (e) {
    alert(`Error adding ticket type: ${e.message}`);
    // Rollback if necessary (though sql.js transactions are simple, might need manual cleanup if partial insert)
  }
}

function addExperience() {
  const id = document.getElementById('newExperienceId').value.trim();
  const name = document.getElementById('newExperienceName').value.trim();
  const dateTime = document.getElementById('newExperienceDateTime').value;
  const description = document.getElementById('newExperienceDescription').value.trim();

  if (!id || !name || !dateTime) {
    alert("Experience ID, Name, and Date & Time are required.");
    return;
  }
   if (!dateTime.includes('T')) {
    alert("Please ensure Date & Time includes both date and time.");
    return;
  }
  try {
    // Check if experience ID already exists
    const checkStmt = db.prepare("SELECT COUNT(*) AS count FROM Experience WHERE id = ?");
    checkStmt.bind([id]);
    checkStmt.step();
    const { count } = checkStmt.getAsObject();
    checkStmt.free();
    if (count > 0) {
        alert(`Experience ID "${id}" already exists. Please use a unique ID.`);
        return;
    }

    db.run("INSERT INTO Experience (id, name, dateTime, description) VALUES (?, ?, ?, ?)", [id, name, dateTime, description]);
    alert(`Experience "${name}" added successfully!`);
    renderAllDropdowns(); // Re-render experience dropdowns
     if (document.getElementById('invitationSelect').value) {
      renderGuestUI(document.getElementById('invitationSelect').value); // Refresh current guest's view
    }
    // Clear fields
    document.getElementById('newExperienceId').value = '';
    document.getElementById('newExperienceName').value = '';
    document.getElementById('newExperienceDateTime').value = '';
    document.getElementById('newExperienceDescription').value = '';
    document.getElementById('experienceTemplateSelect').value = '';
  } catch (e) {
    alert(`Error adding experience: ${e.message}`);
  }
}

function addGuestType() {
    const id = document.getElementById('newGuestTypeId').value.trim();
    const name = document.getElementById('newGuestTypeName').value.trim();
    const options = document.getElementById('newGuestTypeOptions').value.trim();

    if (!id || !name) {
        alert("Guest Type ID and Name are required.");
        return;
    }
    try {
        // Check if guest type ID already exists
        const checkStmt = db.prepare("SELECT COUNT(*) AS count FROM GuestType WHERE id = ?");
        checkStmt.bind([id]);
        checkStmt.step();
        const { count } = checkStmt.getAsObject();
        checkStmt.free();
        if (count > 0) {
            alert(`Guest Type ID "${id}" already exists. Please use a unique ID.`);
            return;
        }

        db.run("INSERT INTO GuestType (id, name, options) VALUES (?, ?, ?)", [id, name, options]);
        alert(`Guest Type "${name}" added successfully!`);
        renderAllDropdowns();
        document.getElementById('newGuestTypeId').value = '';
        document.getElementById('newGuestTypeName').value = '';
        document.getElementById('newGuestTypeOptions').value = '';
        document.getElementById('guestTypeTemplateSelect').value = '';

    } catch (e) {
        alert(`Error adding guest type: ${e.message}`);
    }
}

function assignExperienceToGuestType() {
    const guestTypeId = document.getElementById('assignExpGuestType').value;
    const experienceId = document.getElementById('assignExpExperience').value;

    if (!guestTypeId || !experienceId) {
        alert("Please select both a Guest Type and an Experience to assign.");
        return;
    }
    try {
        db.run("INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES (?, ?)", [guestTypeId, experienceId]);
        alert(`Experience successfully assigned to Guest Type!`);
        
        // If a guest is currently selected in the main view, refresh their UI
        if (document.getElementById('invitationSelect').value) {
          renderGuestUI(document.getElementById('invitationSelect').value); 
        }

        // Crucially, refresh the "Additional Experiences" checklist in the "Create New Invitation" form.
        // This function will use the current value of 'newInvitationGuestTypeId' to determine
        // which experiences to filter out. So, if the 'newInvitationGuestTypeId' matches
        // the 'guestTypeId' to which the experience was just assigned, the checklist will update correctly.
        renderAvailableExperiencesForInvitationCheckboxes(); 

    } catch (e) {
        if (e.message.includes("UNIQUE constraint failed")) {
            alert("This experience is already assigned to this guest type.");
        } else {
            alert(`Error assigning experience: ${e.message}`);
        }
    }
}

function addStandardActivity() {
    const dateTime = document.getElementById('newStdActivityDateTime').value;
    const description = document.getElementById('newStdActivityDescription').value.trim();

    if (!dateTime || !description) {
        alert("Date & Time and Description are required for a standard activity.");
        return;
    }
    if (!dateTime.includes('T')) {
        alert("Please ensure Date & Time includes both date and time for the activity.");
        return;
    }
    try {
        db.run("INSERT INTO StandardActivity (dateTime, description) VALUES (?, ?)", [dateTime, description]);
        alert(`Standard Activity "${description}" added successfully!`);
        if (document.getElementById('invitationSelect').value) {
          renderGuestUI(document.getElementById('invitationSelect').value); // Refresh current guest's standard schedule
        }
        document.getElementById('newStdActivityDateTime').value = '';
        document.getElementById('newStdActivityDescription').value = '';
        document.getElementById('standardActivityTemplateSelect').value = '';
    } catch (e) {
        alert(`Error adding standard activity: ${e.message}`);
    }
}

function addInvitation() {
    const id = document.getElementById('newInvitationId').value.trim();
    const name = document.getElementById('newInviteeName').value.trim();
    const email = document.getElementById('newInviteeEmail').value.trim();
    const ticketTypeId = document.getElementById('newInvitationTicketTypeId').value;
    const guestTypeId = document.getElementById('newInvitationGuestTypeId').value;
    const primaryGuestId = document.getElementById('newInvitationPrimaryGuestId').value.trim() || null; // Handle empty string as NULL

    if (!id || !name || !ticketTypeId || !guestTypeId) {
        alert("Invitation ID, Name, Ticket Type, and Guest Type are required.");
        return;
    }

    // Collect selected options for the guest type
    let selectedOptionsArray = [];
    const optionsContainer = document.getElementById('newInvitationGuestTypeOptionsContainer');
    optionsContainer.querySelectorAll('input[type="text"][data-option-key]').forEach(input => {
        if (input.value.trim() !== '') {
            selectedOptionsArray.push(`${input.dataset.optionKey}:${input.value.trim()}`);
        }
    });
    const optionsString = selectedOptionsArray.join(',');

    // Collect selected additional experiences
    const additionalExperienceIds = [];
    document.querySelectorAll('#newInvitationAdditionalExperiences input[type="checkbox"]:checked').forEach(checkbox => {
        additionalExperienceIds.push(checkbox.value);
    });


    try {
        // Check if invitation ID already exists
        const checkStmt = db.prepare("SELECT COUNT(*) AS count FROM Invitation WHERE id = ?");
        checkStmt.bind([id]);
        checkStmt.step();
        const { count } = checkStmt.getAsObject();
        checkStmt.free();
        if (count > 0) {
            alert(`Invitation ID "${id}" already exists. Please use a unique ID.`);
            return;
        }

        // Check ticket capacity
        const ticketCapacityStmt = db.prepare("SELECT remainingCapacity FROM TicketType WHERE id = ?");
        ticketCapacityStmt.bind([ticketTypeId]);
        let canIssueTicket = false;
        if (ticketCapacityStmt.step()) {
            if (ticketCapacityStmt.getAsObject().remainingCapacity > 0) {
                canIssueTicket = true;
            }
        }
        ticketCapacityStmt.free();

        if (!canIssueTicket) {
            alert(`Selected ticket type "${ticketTypeId}" has no remaining capacity.`);
            return;
        }

        db.run("BEGIN TRANSACTION;");
        db.run(
            "INSERT INTO Invitation (id, name, email, ticketTypeId, guestTypeId, primaryGuestId, options) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, name, email, ticketTypeId, guestTypeId, primaryGuestId, optionsString]
        );
        db.run("UPDATE TicketType SET remainingCapacity = remainingCapacity - 1 WHERE id = ?", [ticketTypeId]);

        // Add direct assignments for experiences
        if (additionalExperienceIds.length > 0) {
            const assignExpStmt = db.prepare("INSERT INTO Invitation_Experience (invitationId, experienceId) VALUES (?, ?)");
            additionalExperienceIds.forEach(expId => {
                assignExpStmt.run([id, expId]);
            });
            assignExpStmt.free();
        }
        db.run("COMMIT;");

        alert(`Invitation for "${name}" created successfully!`);
        renderAllDropdowns();
        renderTicketCapacitySummary();
        renderInvitationSelect(); // Update the main guest selection dropdown
        
        // Clear form fields
        document.getElementById('newInvitationId').value = '';
        document.getElementById('newInviteeName').value = '';
        document.getElementById('newInviteeEmail').value = '';
        document.getElementById('newInvitationTicketTypeId').value = '';
        document.getElementById('newInvitationGuestTypeId').value = '';
        document.getElementById('newInvitationPrimaryGuestId').value = '';
        document.getElementById('newInvitationGuestTypeOptionsContainer').innerHTML = 'Loading options...';
        renderAvailableExperiencesForInvitationCheckboxes(); // Clears and re-renders checkboxes
        document.getElementById('invitationTemplateSelect').value = '';


    } catch (e) {
        db.run("ROLLBACK;"); // Rollback on error
        alert(`Error creating invitation: ${e.message}`);
    }
}

function populateTicketTypeFields() {
    const select = document.getElementById('ticketTypeTemplateSelect');
    const selectedValue = select.value;
    if (!selectedValue) return;
    const [id, name, dates, capacity] = selectedValue.split('|');
    document.getElementById('newTicketTypeId').value = id || '';
    document.getElementById('newTicketTypeName').value = name || '';
    document.getElementById('newTicketTypeDates').value = dates || '';
    document.getElementById('newTicketTypeCapacity').value = capacity || '';
}

function populateExperienceFields() {
    const select = document.getElementById('experienceTemplateSelect');
    const selectedValue = select.value;
    if (!selectedValue) return;
    const [id, name, dateTime, description] = selectedValue.split('|');
    document.getElementById('newExperienceId').value = id || '';
    document.getElementById('newExperienceName').value = name || '';
    document.getElementById('newExperienceDateTime').value = dateTime || '';
    document.getElementById('newExperienceDescription').value = description || '';
}

function populateGuestTypeFields() {
    const select = document.getElementById('guestTypeTemplateSelect');
    const selectedValue = select.value;
    if (!selectedValue) return;
    const [id, name, options] = selectedValue.split('|');
    document.getElementById('newGuestTypeId').value = id || '';
    document.getElementById('newGuestTypeName').value = name || '';
    document.getElementById('newGuestTypeOptions').value = options || '';
}

function populateStandardActivityFields() {
    const select = document.getElementById('standardActivityTemplateSelect');
    const selectedValue = select.value;
    if (!selectedValue) return;
    const [dateTime, description] = selectedValue.split('|');
    document.getElementById('newStdActivityDateTime').value = dateTime || '';
    document.getElementById('newStdActivityDescription').value = description || '';
}

function populateInvitationFields() {
    const select = document.getElementById('invitationTemplateSelect');
    const selectedValue = select.value;

    // Clear additional experience checkboxes from any previous template or state
    document.querySelectorAll('#newInvitationAdditionalExperiences input[type="checkbox"]').forEach(cb => cb.checked = false);

    if (!selectedValue) {
        document.getElementById('newInvitationId').value = '';
        document.getElementById('newInviteeName').value = '';
        document.getElementById('newInviteeEmail').value = '';
        document.getElementById('newInvitationTicketTypeId').value = '';
        document.getElementById('newInvitationGuestTypeId').value = ''; // Clear guest type
        document.getElementById('newInvitationPrimaryGuestId').value = '';
        
        // Render options and experiences based on cleared guest type
        renderGuestTypeOptionsForInvitation('', 'newInvitationGuestTypeOptionsContainer');
        renderAvailableExperiencesForInvitationCheckboxes(); // Update experiences for empty guest type
        return;
    }

    const [id, name, email, ticketTypeId, guestTypeId, options, primaryGuestId] = selectedValue.split('|');
    
    document.getElementById('newInvitationId').value = id || '';
    document.getElementById('newInviteeName').value = name || '';
    document.getElementById('newInviteeEmail').value = email || '';
    document.getElementById('newInvitationTicketTypeId').value = ticketTypeId || '';
    document.getElementById('newInvitationGuestTypeId').value = guestTypeId || ''; // Set guest type
    document.getElementById('newInvitationPrimaryGuestId').value = primaryGuestId || '';

    // Call dependent render functions AFTER setting the guestTypeId
    renderGuestTypeOptionsForInvitation(guestTypeId, 'newInvitationGuestTypeOptionsContainer');
    renderAvailableExperiencesForInvitationCheckboxes(); // <<< THIS IS THE KEY ADDITION/MOVE

    if (options && guestTypeId) {
        setTimeout(() => { 
            options.split(',').forEach(optPair => {
                const [key, val] = optPair.split(':', 2); // Ensure val captures everything after the first colon
                const optInput = document.getElementById(`inv_opt_newInvitationGuestTypeOptionsContainer_${key}`);
                if (optInput) {
                    optInput.value = val || '';
                }
            });
        }, 100); 
    }
}


function downloadDB() {
  const data = db.export();
  const blob = new Blob([data], {type: 'application/octet-stream'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gp_itinerary.sqlite';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initialize the application
init();
