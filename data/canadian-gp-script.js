let db;

async function init() {
  const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });
  db = new SQL.Database();

  // Schema using agreed upon business vocabulary
  db.run(`CREATE TABLE Sector(id TEXT PRIMARY KEY, name TEXT);`);
  db.run(`CREATE TABLE GuestType(id TEXT PRIMARY KEY, name TEXT, options TEXT);`);
  db.run(`CREATE TABLE TicketType(id TEXT PRIMARY KEY, name TEXT, capacity INTEGER NOT NULL DEFAULT 0, remainingCapacity INTEGER NOT NULL DEFAULT 0);`);
  db.run(`CREATE TABLE TicketValidity(ticketTypeId TEXT, date TEXT, FOREIGN KEY(ticketTypeId) REFERENCES TicketType(id));`);
  db.run(`CREATE TABLE StandardActivity(id INTEGER PRIMARY KEY AUTOINCREMENT, dateTime TEXT, description TEXT);`);
  db.run(`CREATE TABLE Experience(id TEXT PRIMARY KEY, name TEXT, dateTime TEXT, description TEXT);`);
  db.run(`CREATE TABLE Invitation(
            id TEXT PRIMARY KEY, name TEXT, email TEXT,
            ticketTypeId TEXT, sectorId TEXT, guestTypeId TEXT, primaryGuestId TEXT,
            options TEXT,
            FOREIGN KEY(ticketTypeId) REFERENCES TicketType(id),
            FOREIGN KEY(sectorId) REFERENCES Sector(id),
            FOREIGN KEY(guestTypeId) REFERENCES GuestType(id),
            FOREIGN KEY(primaryGuestId) REFERENCES Invitation(id)
          );`);
  db.run(`CREATE TABLE GuestType_Experience(guestTypeId TEXT, experienceId TEXT, PRIMARY KEY (guestTypeId, experienceId), FOREIGN KEY(guestTypeId) REFERENCES GuestType(id), FOREIGN KEY(experienceId) REFERENCES Experience(id));`);
  db.run(`CREATE TABLE Invitation_Experience(invitationId TEXT, experienceId TEXT, PRIMARY KEY (invitationId, experienceId), FOREIGN KEY(invitationId) REFERENCES Invitation(id), FOREIGN KEY(experienceId) REFERENCES Experience(id));`);

  // Sector data
  db.run(`INSERT INTO Sector VALUES
  ('sector01','Europe'),
  ('sector02','Asia Pacific'),
  ('sector03','Americas'),
  ('sector04','Middle East'),
  ('sector05','Africa')
`);


  // GuestType data
  db.run(`INSERT INTO GuestType VALUES
    ('guestType01','VIP','request_accommodation,request_transport'),
    ('guestType02','General',''),
    ('guestType03','+1','plus_1');`);

  // TicketType
  db.run(`INSERT INTO TicketType (id, name, capacity, remainingCapacity) VALUES
  ('ticket01','3-Day Pass (13–15 June)', 100, 97),
  ('ticket02','Day 2 Pass (14 June)', 50, 49),
  ('ticket03','Day 3 Pass (15 June)', 75, 75);`);

  db.run(`INSERT INTO TicketValidity VALUES
  ('ticket01','2025-06-13'), ('ticket01','2025-06-14'), ('ticket01','2025-06-15'),
  ('ticket02','2025-06-14'),
  ('ticket03','2025-06-15');`);

  // StandardActivity INSERT
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

  // Experience INSERT
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


  // GuestType_Experience - **MODIFIED TO INDIVIDUAL INSERTS**
  try {
    console.log("Inserting GuestType_Experience data...");
    db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType01', 'exp01');`);
    db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType01', 'exp03');`);
    // db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType01', 'exp05');`); // exp05 is direct for Alice
    db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType01', 'exp08');`);
    // db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType02', 'exp02');`); // exp02 is direct for Bob
    db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType02', 'exp06');`);
    db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType02', 'exp07');`);
    db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType03', 'exp04');`);
    db.run(`INSERT INTO GuestType_Experience (guestTypeId, experienceId) VALUES ('guestType03', 'exp09');`);
    console.log("GuestType_Experience data inserted successfully.");
  } catch (e) {
    console.error("Error inserting GuestType_Experience data:", e);
    console.error("SQL that failed:", e.sql); // If sql.js provides this
    throw e; // Re-throw to stop execution if critical
  }


  // Invitation Data:
  db.run(`INSERT INTO Invitation (id, name, email, ticketTypeId, sectorId, guestTypeId, options, primaryGuestId) VALUES
    ('guest01','Alice Freeman','alice@ukfans.com','ticket01','sector01','guestType01', 'request_accommodation:Four Seasons,request_transport:Helicopter', NULL),
    ('guest02','Bob Wang','bob@asiafans.com','ticket02','sector02','guestType02', NULL, NULL),
    ('guest03','Charlie Guest','charlie@ukfans.com','ticket01','sector01','guestType03', 'plus_1', 'guest01');`);

  // Adding additional direct experiences to specific invitations
  console.log("Inserting Invitation_Experience data...");
  db.run(`INSERT INTO Invitation_Experience (invitationId, experienceId) VALUES ('guest01', 'exp05');`); // This was line 111
  db.run(`INSERT INTO Invitation_Experience (invitationId, experienceId) VALUES ('guest02', 'exp02');`);
  console.log("Invitation_Experience data inserted successfully.");


  // Initial renders
  renderTicketCapacitySummary();
  renderAllStandardActivities();
  renderInvitationSelect();
  renderDropdown('newInvitationTicketTypeId', 'TicketType', true, null, 'remainingCapacity');
  renderDropdown('newInvitationSectorId', 'Sector', true);
  renderDropdown('newInvitationGuestTypeId', 'GuestType', true);
  renderDropdown('assignExpGuestType', 'GuestType', false);
  renderDropdown('assignExpExperience', 'Experience', false);
  renderAvailableExperiencesForInvitationCheckboxes();

  const initialInvitationId = document.getElementById('invitationSelect').value;
  if (initialInvitationId) {
    renderGuestUI(initialInvitationId);
  }
}

// Add this new function to render all standard activities without filtering by guest
function renderAllStandardActivities() {
  const allScheduleRes = db.exec(`
    SELECT dateTime, description
    FROM StandardActivity
    ORDER BY dateTime
  `);

  if (!allScheduleRes.length || !allScheduleRes[0].values.length) {
    document.getElementById('standardActivitySchedule').innerHTML = '<p>No standard schedule entries available.</p>';
    return;
  }

  const all = allScheduleRes[0].values;

  // Group by date
  const byDate = {};
  all.forEach(([dt, desc]) => {
    const date = dt.split('T')[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push([dt, desc]);
  });

  let html = '<table><thead><tr><th>Date/Time</th><th>Description</th></tr></thead><tbody>';

  // Sort dates and display grouped activities
  Object.keys(byDate).sort().forEach(date => {
    const dateObj = new Date(date + 'T00:00:00'); // Ensure correct date parsing for UTC/Locale
    const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    html += `<tr class="date-header"><td colspan="2"><strong>${formattedDate}</strong></td></tr>`;

    byDate[date].forEach(([dt, desc]) => {
      const time = new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      html += `<tr>
        <td>${time}</td>
        <td>${desc}</td>
      </tr>`;
    });
  });

  html += '</tbody></table>';
  document.getElementById('standardActivitySchedule').innerHTML = html;
}

function renderAllDropdowns(){
    renderDropdown('newInvitationTicketTypeId', 'TicketType', true, null, 'remainingCapacity');
    renderDropdown('newInvitationSectorId', 'Sector', true);
    renderDropdown('newInvitationGuestTypeId', 'GuestType', true);
    renderDropdown('assignExpGuestType', 'GuestType', false);
    renderDropdown('assignExpExperience', 'Experience', false);
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
    renderAvailableExperiencesForInvitationCheckboxes();
}

function renderAvailableExperiencesForInvitationCheckboxes() {
    const container = document.getElementById('newInvitationAdditionalExperiences');
    container.innerHTML = '';

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
    document.getElementById('additionalExperienceItinerary').innerHTML = '';
    return;
  }

  // Determine the effective invitation ID for fetching guest details (especially options)
  let effectiveInvitationIdForDetails = invitationId;
  let isPlusOne = false;
  let primaryGuestNameForDisplay = null; // To store the primary guest's name if this is a +1

  const plusOneCheckStmt = db.prepare(`SELECT primaryGuestId, name FROM Invitation WHERE id = ?`);
  plusOneCheckStmt.bind([invitationId]);
  if (plusOneCheckStmt.step()) {
      const currentGuestData = plusOneCheckStmt.getAsObject();
      if (currentGuestData.primaryGuestId) {
          isPlusOne = true;
          effectiveInvitationIdForDetails = currentGuestData.primaryGuestId; // Target primary guest for options
          console.log(`Guest ${invitationId} is a +1. Fetching options from primary guest ${effectiveInvitationIdForDetails}.`);

          // Fetch the primary guest's name for the "Accompanies" field
          const primaryNameStmt = db.prepare(`SELECT name FROM Invitation WHERE id = ?`);
          primaryNameStmt.bind([effectiveInvitationIdForDetails]);
          if (primaryNameStmt.step()) {
              primaryGuestNameForDisplay = primaryNameStmt.getAsObject().name;
          }
          primaryNameStmt.free();
      }
  }
  plusOneCheckStmt.free();


  // Fetch guest details. If it's a +1, inv.options will come from the primary guest.
  // Other details (name, email, ticket, sector, guestType) will still be the +1's own.
  const guestStmt = db.prepare(`
    SELECT
        (SELECT name FROM Invitation WHERE id = ?) AS currentGuestName,
        (SELECT email FROM Invitation WHERE id = ?) AS currentGuestEmail,
        (SELECT options FROM Invitation WHERE id = ?) AS effectiveGuestOptions, -- Options from effective ID
        tt.name AS ticketTypeName, tt.id AS ticketTypeId,
        s.name AS sectorName, s.id AS sectorId,
        gt.name AS guestTypeName, gt.id AS guestTypeId
    FROM Invitation inv_current          -- Alias for the current guest being viewed
    JOIN TicketType tt ON inv_current.ticketTypeId = tt.id
    JOIN Sector s ON inv_current.sectorId = s.id
    JOIN GuestType gt ON inv_current.guestTypeId = gt.id
    WHERE inv_current.id = ?
  `);
  // Bind parameters: current guest's ID for their own details, effective ID for options
  guestStmt.bind([
      invitationId,                         // For currentGuestName
      invitationId,                         // For currentGuestEmail
      effectiveInvitationIdForDetails,      // For effectiveGuestOptions
      invitationId                          // For WHERE clause to get ticket, sector, guestType of current guest
    ]);


  if (!guestStmt.step()) {
    guestStmt.free();
    document.getElementById('guestDetails').innerHTML = `<p>Details for invitation ID '${invitationId}' not found.</p>`;
    document.getElementById('additionalExperienceItinerary').innerHTML = '';
    return;
  }
  const details = guestStmt.getAsObject();
  guestStmt.free();

  let perksListItems = [];

  // Use effectiveGuestOptions for displaying perks
  if (details.effectiveGuestOptions) {
    console.log(`Displaying perks based on options from ${isPlusOne ? `primary guest ${effectiveInvitationIdForDetails}` : `guest ${invitationId}`}: "${details.effectiveGuestOptions}"`);
    details.effectiveGuestOptions.split(',')
      .filter(Boolean)
      .forEach(opt => {
        const [key, ...valParts] = opt.split(':');
        const val = valParts.join(':');
        perksListItems.push(`<li>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${val || '<i>Not specified</i>'}</li>`);
      });
  } else {
     console.log(`No perks/options found for effective guest ${effectiveInvitationIdForDetails}`);
  }

  // Handling "Additional Assigned Experiences" in perks list - this should still be from the primary guest if +1
  // The renderExperienceItineraryForGuest function handles the actual itinerary display correctly.
  // This part is about the "Selected Perks/Options" summary.
  // If it's a +1, we should show the primary guest's direct experiences here.
  let directExperiencesForPerksList = [];
  const directExpStmt = db.prepare(`
    SELECT E.name AS experienceName, E.dateTime AS experienceDateTime
    FROM Experience E
    JOIN Invitation_Experience IE ON E.id = IE.experienceId
    WHERE IE.invitationId = ? -- Use effectiveInvitationIdForDetails to get primary's direct if +1
    ORDER BY E.dateTime
  `);
  directExpStmt.bind([effectiveInvitationIdForDetails]); // Use effective ID
  let hasDirectExperiencesForPerks = false;
  while(directExpStmt.step()) {
    if (!hasDirectExperiencesForPerks) {
        if (perksListItems.length > 0) { // Check if there were other perks from options string
            perksListItems.push(`<li><strong>Additional Assigned Experiences:</strong></li>`);
        } else {
            perksListItems.push(`<strong>Additional Assigned Experiences:</strong>`);
        }
        hasDirectExperiencesForPerks = true;
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
    optionsHtml = "<p>No specific perks or additional experiences recorded.</p>";
  }

  document.getElementById('guestDetails').innerHTML = `
    <h3>Guest Details</h3>
    <p><strong>Name:</strong> ${details.currentGuestName}</p>
    <p><strong>Email:</strong> ${details.currentGuestEmail || 'N/A'}</p>
    <p><strong>Ticket Type:</strong> ${details.ticketTypeName} (ID: ${details.ticketTypeId})</p>
    <p><strong>Sector:</strong> ${details.sectorName} (ID: ${details.sectorId})</p>
    <p><strong>Guest Type:</strong> ${details.guestTypeName} (ID: ${details.guestTypeId})</p>
    ${isPlusOne && primaryGuestNameForDisplay ? `<p><strong>Accompanies:</strong> ${primaryGuestNameForDisplay}</p>` : ''}
    <p><strong>Selected Perks/Options:</strong></p>
    ${optionsHtml}
  `;

  // Call experience itinerary rendering (this function already handles +1 logic correctly for experiences)
  renderExperienceItineraryForGuest(invitationId, details.guestTypeId);
}

function renderExperienceItineraryForGuest(invitationId, guestTypeIdOfCurrentGuest) { // Renamed for utmost clarity
  const itineraryDiv = document.getElementById('additionalExperienceItinerary');
  console.log(`Rendering experience itinerary for ${invitationId}, guestTypeOfCurrentGuest ${guestTypeIdOfCurrentGuest}`);

  let experiences = {};
  let effectiveGuestTypeIdForExpCollection = guestTypeIdOfCurrentGuest;    // Start with the current guest's type
  let effectiveInvitationIdForDirectExpCollection = invitationId; // Start with the current guest's ID

  // Determine if this guest is a +1
  const isPlusOneStmt = db.prepare(`SELECT primaryGuestId FROM Invitation WHERE id = ?`);
  isPlusOneStmt.bind([invitationId]);
  let primaryGuestId = null;
  if (isPlusOneStmt.step()) {
    primaryGuestId = isPlusOneStmt.getAsObject().primaryGuestId;
  }
  isPlusOneStmt.free();

  if (primaryGuestId) {
    // This guest IS a +1. All experiences come from the primary guest.
    console.log(`Guest ${invitationId} is a +1 for ${primaryGuestId}. Overriding experience collection targets.`);
    effectiveInvitationIdForDirectExpCollection = primaryGuestId; // Direct experiences from primary

    // Get primary guest's GuestType ID
    const primaryGuestDetailsStmt = db.prepare(`SELECT guestTypeId FROM Invitation WHERE id = ?`);
    primaryGuestDetailsStmt.bind([primaryGuestId]);
    if (primaryGuestDetailsStmt.step()) {
        effectiveGuestTypeIdForExpCollection = primaryGuestDetailsStmt.getAsObject().guestTypeId;
    }
    primaryGuestDetailsStmt.free();
    console.log(`Effective GuestType for collection is now ${effectiveGuestTypeIdForExpCollection} (from primary ${primaryGuestId})`);
  } else {
    console.log(`Guest ${invitationId} is NOT a +1. Using their own type ${guestTypeIdOfCurrentGuest} and ID ${invitationId} for collection.`);
    // effectiveGuestTypeIdForExpCollection and effectiveInvitationIdForDirectExpCollection remain as initially set
  }

  // --- Experience Collection Block (Uses EFFECTIVE IDs) ---

  // 1. Get experiences from the EFFECTIVE guest's GuestType
  console.log(`Collecting experiences from GuestType_Experience using guestTypeId: ${effectiveGuestTypeIdForExpCollection}`);
  const guestTypeExpStmt = db.prepare(`
    SELECT E.id, E.name, E.dateTime, E.description
    FROM Experience E
    JOIN GuestType_Experience GTE ON E.id = GTE.experienceId
    WHERE GTE.guestTypeId = ?
  `);
  guestTypeExpStmt.bind([effectiveGuestTypeIdForExpCollection]); // MUST use the determined effective type
  while(guestTypeExpStmt.step()) {
    const exp = guestTypeExpStmt.getAsObject();
    experiences[exp.id] = exp;
    console.log(`  Collected GTE: ${exp.name} (for type ${effectiveGuestTypeIdForExpCollection})`);
  }
  guestTypeExpStmt.free();

  // 2. Get experiences directly assigned to the EFFECTIVE guest
  console.log(`Collecting experiences from Invitation_Experience using invitationId: ${effectiveInvitationIdForDirectExpCollection}`);
  const directExpStmt = db.prepare(`
    SELECT E.id, E.name, E.dateTime, E.description
    FROM Experience E
    JOIN Invitation_Experience IE ON E.id = IE.experienceId
    WHERE IE.invitationId = ?
  `);
  directExpStmt.bind([effectiveInvitationIdForDirectExpCollection]); // MUST use the determined effective ID
  while(directExpStmt.step()) {
    const exp = directExpStmt.getAsObject();
    experiences[exp.id] = exp;
    console.log(`  Collected IE: ${exp.name} (for inv ${effectiveInvitationIdForDirectExpCollection})`);
  }
  directExpStmt.free();

  // --- END of Experience Collection Block ---


  // Filter by ticket validity dates (ALWAYS based on the CURRENT guest's - invitationId - ticket)
  const ticketTypeIdStmt = db.prepare("SELECT ticketTypeId FROM Invitation WHERE id = ?");
  ticketTypeIdStmt.bind([invitationId]); // Original invitationId for ticket
  let ticketTypeId = null;
  if(ticketTypeIdStmt.step()) {
    ticketTypeId = ticketTypeIdStmt.getAsObject().ticketTypeId;
  }
  ticketTypeIdStmt.free();

  const validDates = [];
  if(ticketTypeId) {
    const validDatesStmt = db.prepare("SELECT date FROM TicketValidity WHERE ticketTypeId = ?");
    validDatesStmt.bind([ticketTypeId]);
    while(validDatesStmt.step()) {
      validDates.push(validDatesStmt.getAsObject().date);
    }
    validDatesStmt.free();
  }

  console.log(`Total unique experiences collected (pre-filter) for ${invitationId}: ${Object.keys(experiences).length}. Source type: ${effectiveGuestTypeIdForExpCollection}, Source direct: ${effectiveInvitationIdForDirectExpCollection}`);
  console.log(`Valid dates for ${invitationId}'s ticket (${ticketTypeId}): ${validDates.join(', ')}`);

  let html = '<h3>Exclusive Experiences Itinerary</h3>';
  const sortedExperiences = Object.values(experiences).sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));

  let tableContent = '';
  let displayedCount = 0;
  sortedExperiences.forEach(exp => {
    if (!exp || !exp.dateTime) {
        console.warn("Skipping an invalid experience object:", exp);
        return;
    }
    const expDate = exp.dateTime.substring(0,10);
    if(validDates.includes(expDate)){
      tableContent += `
      <tr>
          <td>${new Date(exp.dateTime).toLocaleString()}</td>
          <td>${exp.name}</td>
          <td>${exp.description || 'N/A'}</td>
      </tr>`;
      displayedCount++;
    }
  });

  if (tableContent === '') {
    html += '<p>No exclusive experiences scheduled for this guest on their valid ticket days, or none assigned.</p>';
  } else {
    html += `<table><thead><tr><th>Date & Time</th><th>Experience</th><th>Details</th></tr></thead><tbody>${tableContent}</tbody></table>`;
  }

  itineraryDiv.innerHTML = html;
  console.log(`Experience itinerary for ${invitationId} rendered with ${displayedCount} experiences shown.`);
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
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`Invalid date format: ${date}. Please use YYYY-MM-DD.`);
      }
      stmt.run([id, date]);
    });
    stmt.free();
    alert(`Ticket Type "${name}" added successfully!`);
    renderAllDropdowns();
    renderTicketCapacitySummary();
    document.getElementById('newTicketTypeId').value = '';
    document.getElementById('newTicketTypeName').value = '';
    document.getElementById('newTicketTypeDates').value = '';
    document.getElementById('newTicketTypeCapacity').value = '';
    document.getElementById('ticketTypeTemplateSelect').value = '';
  } catch (e) {
    alert(`Error adding ticket type: ${e.message}`);
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
    renderAllDropdowns();
     if (document.getElementById('invitationSelect').value) {
      renderGuestUI(document.getElementById('invitationSelect').value);
    }
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

        if (document.getElementById('invitationSelect').value) {
          renderGuestUI(document.getElementById('invitationSelect').value);
        }
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

        renderAllStandardActivities();

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
    const sectorId = document.getElementById('newInvitationSectorId').value;
    const guestTypeId = document.getElementById('newInvitationGuestTypeId').value;
    const primaryGuestId = document.getElementById('newInvitationPrimaryGuestId').value.trim() || null;

    if (!id || !name || !ticketTypeId || !guestTypeId || !sectorId) {
        alert("Invitation ID, Name, Ticket Type, Sector, and Guest Type are required.");
        return;
    }

    let selectedOptionsArray = [];
    const optionsContainer = document.getElementById('newInvitationGuestTypeOptionsContainer');
    optionsContainer.querySelectorAll('input[type="text"][data-option-key]').forEach(input => {
        if (input.value.trim() !== '') {
            selectedOptionsArray.push(`${input.dataset.optionKey}:${input.value.trim()}`);
        }
    });
    const optionsString = selectedOptionsArray.join(',');

    const additionalExperienceIds = [];
    document.querySelectorAll('#newInvitationAdditionalExperiences input[type="checkbox"]:checked').forEach(checkbox => {
        additionalExperienceIds.push(checkbox.value);
    });


    try {
        const checkStmt = db.prepare("SELECT COUNT(*) AS count FROM Invitation WHERE id = ?");
        checkStmt.bind([id]);
        checkStmt.step();
        const { count } = checkStmt.getAsObject();
        checkStmt.free();
        if (count > 0) {
            alert(`Invitation ID "${id}" already exists. Please use a unique ID.`);
            return;
        }

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
            "INSERT INTO Invitation (id, name, email, ticketTypeId, sectorId, guestTypeId, primaryGuestId, options) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [id, name, email, ticketTypeId, sectorId, guestTypeId, primaryGuestId, optionsString]
        );
        db.run("UPDATE TicketType SET remainingCapacity = remainingCapacity - 1 WHERE id = ?", [ticketTypeId]);

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
        renderInvitationSelect();

        document.getElementById('newInvitationId').value = '';
        document.getElementById('newInviteeName').value = '';
        document.getElementById('newInviteeEmail').value = '';
        document.getElementById('newInvitationTicketTypeId').value = '';
        document.getElementById('newInvitationSectorId').value = '';
        document.getElementById('newInvitationGuestTypeId').value = '';
        document.getElementById('newInvitationPrimaryGuestId').value = '';
        document.getElementById('newInvitationGuestTypeOptionsContainer').innerHTML = 'Loading options...';
        renderAvailableExperiencesForInvitationCheckboxes();
        document.getElementById('invitationTemplateSelect').value = '';

    } catch (e) {
        db.run("ROLLBACK;");
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
    // document.getElementById('newTicketTypeCapacity').value = capacity || ''; // Capacity usually manual
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

    document.querySelectorAll('#newInvitationAdditionalExperiences input[type="checkbox"]').forEach(cb => cb.checked = false);

    if (!selectedValue) {
        document.getElementById('newInvitationId').value = '';
        document.getElementById('newInviteeName').value = '';
        document.getElementById('newInviteeEmail').value = '';
        document.getElementById('newInvitationTicketTypeId').value = '';
        document.getElementById('newInvitationSectorId').value = '';
        document.getElementById('newInvitationGuestTypeId').value = '';
        document.getElementById('newInvitationPrimaryGuestId').value = '';

        renderGuestTypeOptionsForInvitation('', 'newInvitationGuestTypeOptionsContainer');
        renderAvailableExperiencesForInvitationCheckboxes();
        return;
    }

    const parts = selectedValue.split('|');
    const idVal = parts[0] || '';
    const nameVal = parts[1] || '';
    const emailVal = parts[2] || '';
    const ticketTypeIdVal = parts[3] || '';
    const sectorIdVal = parts[4] || '';
    const guestTypeIdVal = parts[5] || '';
    const primaryGuestIdVal = parts[6] || '';

    document.getElementById('newInvitationId').value = idVal;
    document.getElementById('newInviteeName').value = nameVal;
    document.getElementById('newInviteeEmail').value = emailVal;
    document.getElementById('newInvitationTicketTypeId').value = ticketTypeIdVal;
    document.getElementById('newInvitationSectorId').value = sectorIdVal;
    document.getElementById('newInvitationGuestTypeId').value = guestTypeIdVal;
    document.getElementById('newInvitationPrimaryGuestId').value = primaryGuestIdVal;

    renderGuestTypeOptionsForInvitation(guestTypeIdVal, 'newInvitationGuestTypeOptionsContainer');
    renderAvailableExperiencesForInvitationCheckboxes();
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
