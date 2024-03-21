// Object to store user and business data
let userData = [];
let businessData = [];

// Function to show the registration or login form
function showForm(formId) {
    const forms = document.querySelectorAll('main section');
    forms.forEach(form => {
        if (form.id === formId) {
            form.classList.remove('hidden');
        } else {
            form.classList.add('hidden');
        }
    });
}

// Handle User Registration
document.querySelector('#userRegistrationForm form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = this.name.value;
    const email = this.email.value;
    const phone = this.phone.value;
    const password = this.password.value;

    const newUser = { name, email, phone, password };
    let users = JSON.parse(localStorage.getItem('userData')) || [];
    users.push(newUser);
    localStorage.setItem('userData', JSON.stringify(users));

    console.log('Registered users:', JSON.parse(localStorage.getItem('userData'))); // Log to check data

    showDashboard('user', newUser);
});


// Handle User Login

document.querySelector('#userLoginForm form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;

    const users = JSON.parse(localStorage.getItem('userData')) || [];
    console.log('Attempting to find user:', email); // Log to check input email
    console.log('Loaded users:', users); // Log to check loaded users

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        console.log('User found:', user); // Log if user is found
        showDashboard('user', user);
    } else {
        console.error('Invalid login credentials'); // Log if credentials are invalid
        alert('Invalid login credentials');
    }
});


// Handle Business Registration Step 1 to Step 2 Transition
document.getElementById('toStep2').addEventListener('click', function () {
    const businessName = document.querySelector('#businessRegistrationFormStep1 [name="businessName"]').value;
    const ownerName = document.querySelector('#businessRegistrationFormStep1 [name="ownerName"]').value;
    const ownerContact = document.querySelector('#businessRegistrationFormStep1 [name="ownerContact"]').value;
    const ownerEmail = document.querySelector('#businessRegistrationFormStep1 [name="ownerEmail"]').value;
    const password = document.querySelector('#businessRegistrationFormStep1 [name="password"]').value;

    // Temporarily store business data
    sessionStorage.setItem('tempBusiness', JSON.stringify({ businessName, ownerName, ownerContact, ownerEmail, password }));
    showForm('businessRegistrationFormStep2');
});

// Handle Business Registration Final Step
document.querySelector('#businessRegistrationFormStep2 form').addEventListener('submit', function (event) {
    event.preventDefault();
    const tempBusiness = JSON.parse(sessionStorage.getItem('tempBusiness'));
    const serviceName = this.serviceName.value;
    const offer = this.offer.value;

    const newBusiness = { ...tempBusiness, serviceName, offer };
    let businesses = JSON.parse(localStorage.getItem('businessData')) || [];
    businesses.push(newBusiness);
    localStorage.setItem('businessData', JSON.stringify(businesses));

    console.log('Registered businesses:', JSON.parse(localStorage.getItem('businessData'))); // Log to check data

    showDashboard('business', newBusiness);
    sessionStorage.removeItem('tempBusiness');
});


// Handle Business Login
document.querySelector('#businessLoginForm form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;

    const businesses = JSON.parse(localStorage.getItem('businessData')) || [];
    console.log('Attempting to find business:', email); // Log to check input email
    console.log('Loaded businesses:', businesses); // Log to check loaded businesses

    const business = businesses.find(business => business.ownerEmail === email && business.password === password);
    if (business) {
        console.log('Business found:', business); // Log if business is found

        // Store the current business email in sessionStorage
        sessionStorage.setItem('currentBusinessEmail', business.ownerEmail);

        showDashboard('business', business);
    } else {
        console.error('Invalid login credentials for business'); // Log if credentials are invalid
        alert('Invalid login credentials for business');
    }
});



// Function to show the user or business dashboard
function showDashboard(type, data) {
    if (type === 'user') {
        document.getElementById('userDashboard').classList.remove('hidden');
        document.getElementById('userDashboard').querySelector('p').textContent = `Welcome, ${data.name}!`;

        // Populate offers for user
        const offersList = document.getElementById('offersList');
        offersList.innerHTML = ''; // Clear existing offers

        const businesses = JSON.parse(localStorage.getItem('businessData')) || [];
        businesses.forEach(business => {
            const offerElement = document.createElement('div');
            offerElement.className = 'offer';
            offerElement.innerHTML = `
                <h3>${business.businessName}</h3>
                <p><strong>Service:</strong> ${business.serviceName}</p>
                <p><strong>Offer:</strong> ${business.offer}</p>
            `;
            offersList.appendChild(offerElement);
        });
    } else if (type === 'business') {
        document.getElementById('businessDashboard').classList.remove('hidden');
        document.getElementById('businessDashboard').querySelector('p').textContent = `Welcome, ${data.businessName}!`;

        // Fill in the existing business details
        document.querySelector('#businessDashboard [name="updatedServiceName"]').value = data.serviceName;
        document.querySelector('#businessDashboard [name="updatedOffer"]').value = data.offer;
    }
    // Hide other sections
    document.querySelector('header').classList.add('hidden');
    const mainChildren = document.querySelector('main').children;
    for (let i = 0; i < mainChildren.length; i++) {
        if (mainChildren[i].id !== `${type}Dashboard`) {
            mainChildren[i].classList.add('hidden');
        }
    }
}

// Handle Business Dashboard Update
document.querySelector('#businessDashboard form').addEventListener('submit', function (event) {
    event.preventDefault();
    const updatedServiceName = this.updatedServiceName.value;
    const updatedOffer = this.updatedOffer.value;

    // Retrieve the current business email from sessionStorage
    const currentBusinessEmail = sessionStorage.getItem('currentBusinessEmail');

    // Retrieve and update the business data
    let businesses = JSON.parse(localStorage.getItem('businessData')) || [];
    let business = businesses.find(business => business.ownerEmail === currentBusinessEmail);

    if (business) {
        // Update the business data
        business.serviceName = updatedServiceName;
        business.offer = updatedOffer;

        // Save the updated data back to localStorage
        localStorage.setItem('businessData', JSON.stringify(businesses));

        // Confirmation popup
        alert('Values updated successfully!');
    } else {
        console.error('Business not found for update');
    }

    console.log('Updated business data:', business); // Log the updated business data
});





// Event listeners for the navigation buttons
document.getElementById('userLoginBtn').addEventListener('click', () => showForm('userLoginForm'));
document.getElementById('userRegisterBtn').addEventListener('click', () => showForm('userRegistrationForm'));
document.getElementById('businessLoginBtn').addEventListener('click', () => showForm('businessLoginForm'));
document.getElementById('businessRegisterBtn').addEventListener('click', () => showForm('businessRegistrationFormStep1'));
document.getElementById('businessLoginBtn').addEventListener('click', () => showForm('businessLoginForm'));



// Logout functionality
document.getElementById('userLogout').addEventListener('click', () => window.location.reload());
document.getElementById('businessLogout').addEventListener('click', () => window.location.reload());

