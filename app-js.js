// Set current date as default
var today = new Date();
document.getElementById('date').value = today.toISOString().split('T')[0];

// Tab switching functionality
document.getElementById('btn-calculator').addEventListener('click', function() {
    switchTab('calculator');
});

document.getElementById('btn-info').addEventListener('click', function() {
    switchTab('info');
});

document.getElementById('btn-research').addEventListener('click', function() {
    switchTab('research');
});

function switchTab(tabId) {
    // Hide all tabs
    document.getElementById('calculator').classList.remove('active');
    document.getElementById('info').classList.remove('active');
    document.getElementById('research').classList.remove('active');
    
    // Deactivate all buttons
    document.getElementById('btn-calculator').classList.remove('active');
    document.getElementById('btn-info').classList.remove('active');
    document.getElementById('btn-research').classList.remove('active');
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Activate selected button
    document.getElementById('btn-' + tabId).classList.add('active');
}

// Calculation
document.getElementById('calculate-btn').addEventListener('click', function() {
    calculateScores();
});

function calculateScores() {
    // Get limb lengths
    var rightLimbLength = parseFloat(document.getElementById('right-limb-length').value);
    var leftLimbLength = parseFloat(document.getElementById('left-limb-length').value);
    
    if (!rightLimbLength || !leftLimbLength) {
        alert('Please enter the limb lengths.');
        return;
    }
    
    // Values for right leg
    var rightAnterior = parseFloat(document.getElementById('right-anterior').value) || 0;
    var rightPosteromedial = parseFloat(document.getElementById('right-posteromedial').value) || 0;
    var rightPosterolateral = parseFloat(document.getElementById('right-posterolateral').value) || 0;
    
    // Values for left leg
    var leftAnterior = parseFloat(document.getElementById('left-anterior').value) || 0;
    var leftPosteromedial = parseFloat(document.getElementById('left-posteromedial').value) || 0;
    var leftPosterolateral = parseFloat(document.getElementById('left-posterolateral').value) || 0;
    
    // Calculation for right leg
    var rightSum = rightAnterior + rightPosteromedial + rightPosterolateral;
    var rightComposite = (rightSum / (3 * rightLimbLength)) * 100;
    
    // Calculation for left leg
    var leftSum = leftAnterior + leftPosteromedial + leftPosterolateral;
    var leftComposite = (leftSum / (3 * leftLimbLength)) * 100;
    
    // Display results
    document.getElementById('right-composite-percent').textContent = rightComposite.toFixed(2) + '%';
    document.getElementById('left-composite-percent').textContent = leftComposite.toFixed(2) + '%';
    
    // Calculate asymmetries
    var anteriorAsymmetry = Math.abs(rightAnterior - leftAnterior);
    var posteromedialAsymmetry = Math.abs(rightPosteromedial - leftPosteromedial);
    var posterolateralAsymmetry = Math.abs(rightPosterolateral - leftPosterolateral);
    var compositeAsymmetry = Math.abs(rightComposite - leftComposite);
    
    // Display asymmetries
    var asymmetryHTML = '<table class="asymmetry-table">' +
                        '<tr><th>Direction</th><th>Asymmetry</th><th>Risk Assessment</th></tr>';
    
    // Anterior
    var anteriorRisk = anteriorAsymmetry >= 4.0 ? 
        '<span class="risk-indicator risk-high">High Risk (2.5× increased)</span>' : 
        anteriorAsymmetry >= 2.0 ? 
        '<span class="risk-indicator risk-moderate">Moderate Risk</span>' : 
        '<span class="risk-indicator risk-low">Low Risk</span>';
    
    asymmetryHTML += '<tr><td>Anterior</td><td>' + anteriorAsymmetry.toFixed(2) + ' cm</td><td>' + anteriorRisk + '</td></tr>';
    
    // Posteromedial
    var pmRisk = posteromedialAsymmetry >= 6.0 ? 
        '<span class="risk-indicator risk-high">High Risk</span>' : 
        posteromedialAsymmetry >= 4.0 ? 
        '<span class="risk-indicator risk-moderate">Moderate Risk</span>' : 
        '<span class="risk-indicator risk-low">Low Risk</span>';
    
    asymmetryHTML += '<tr><td>Posteromedial</td><td>' + posteromedialAsymmetry.toFixed(2) + ' cm</td><td>' + pmRisk + '</td></tr>';
    
    // Posterolateral
    var plRisk = posterolateralAsymmetry >= 6.0 ? 
        '<span class="risk-indicator risk-high">High Risk</span>' : 
        posterolateralAsymmetry >= 4.0 ? 
        '<span class="risk-indicator risk-moderate">Moderate Risk</span>' : 
        '<span class="risk-indicator risk-low">Low Risk</span>';
    
    asymmetryHTML += '<tr><td>Posterolateral</td><td>' + posterolateralAsymmetry.toFixed(2) + ' cm</td><td>' + plRisk + '</td></tr>';
    
    // Composite
    var compRisk = compositeAsymmetry >= 4.0 ? 
        '<span class="risk-indicator risk-high">High Risk</span>' : 
        compositeAsymmetry >= 2.0 ? 
        '<span class="risk-indicator risk-moderate">Moderate Risk</span>' : 
        '<span class="risk-indicator risk-low">Low Risk</span>';
    
    asymmetryHTML += '<tr><td><strong>Composite</strong></td><td>' + compositeAsymmetry.toFixed(2) + '%</td><td>' + compRisk + '</td></tr>';
    
    asymmetryHTML += '</table>';
    
    document.getElementById('asymmetry-container').innerHTML = asymmetryHTML;
    
    // Calculate LSI
    var lowerComposite = Math.min(rightComposite, leftComposite);
    var higherComposite = Math.max(rightComposite, leftComposite);
    var lsi = (lowerComposite / higherComposite) * 100;
    
    // Display LSI
    var lsiHTML = '<div class="lsi-value">' + lsi.toFixed(2) + '%</div>';
    
    // LSI Interpretation
    var lsiInterpretation = '';
    if (lsi >= 94) {
        lsiInterpretation = '<span class="risk-indicator risk-low">Excellent Symmetry (Low Risk)</span>';
    } else if (lsi >= 90) {
        lsiInterpretation = '<span class="risk-indicator risk-moderate">Good Symmetry (Moderate Risk)</span>';
    } else {
        lsiInterpretation = '<span class="risk-indicator risk-high">Poor Symmetry (High Risk)</span> - Significant functional deficit detected';
    }
    
    lsiHTML += '<div>' + lsiInterpretation + '</div>';
    
    document.getElementById('lsi-container').innerHTML = lsiHTML;
    
    // Save data to local storage
    saveDataToLocalStorage();
}

// Save data to local storage for offline use
function saveDataToLocalStorage() {
    const data = {
        patient: document.getElementById('patient').value,
        therapist: document.getElementById('therapist').value,
        date: document.getElementById('date').value,
        rightLimbLength: document.getElementById('right-limb-length').value,
        leftLimbLength: document.getElementById('left-limb-length').value,
        rightAnterior: document.getElementById('right-anterior').value,
        rightPosteromedial: document.getElementById('right-posteromedial').value,
        rightPosterolateral: document.getElementById('right-posterolateral').value,
        leftAnterior: document.getElementById('left-anterior').value,
        leftPosteromedial: document.getElementById('left-posteromedial').value,
        leftPosterolateral: document.getElementById('left-posterolateral').value
    };
    
    localStorage.setItem('ybtData', JSON.stringify(data));
}

// Load data from local storage
function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem('ybtData');
    
    if (storedData) {
        const data = JSON.parse(storedData);
        
        document.getElementById('patient').value = data.patient || '';
        document.getElementById('therapist').value = data.therapist || '';
        document.getElementById('date').value = data.date || today.toISOString().split('T')[0];
        document.getElementById('right-limb-length').value = data.rightLimbLength || '';
        document.getElementById('left-limb-length').value = data.leftLimbLength || '';
        document.getElementById('right-anterior').value = data.rightAnterior || '';
        document.getElementById('right-posteromedial').value = data.rightPosteromedial || '';
        document.getElementById('right-posterolateral').value = data.rightPosterolateral || '';
        document.getElementById('left-anterior').value = data.leftAnterior || '';
        document.getElementById('left-posteromedial').value = data.leftPosteromedial || '';
        document.getElementById('left-posterolateral').value = data.leftPosterolateral || '';
    }
}

// Load data when page loads
window.addEventListener('load', loadDataFromLocalStorage);