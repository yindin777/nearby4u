// Initialize Supabase
const { createClient } = supabase;
const supabaseUrl = 'https://ohaxrfpokimcfcvfldze.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYXhyZnBva2ltY2ZjdmZsZHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzMyNTcsImV4cCI6MjA0ODE0OTI1N30.7_cjAvfme7sbM8AxTBPiu3VK_eBGm-DWxYH2QknAMUw'; // Replace with your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch providers from Supabase
async function fetchProviders() {
    const { data, error } = await supabase
        .from('providers') // Use the actual table name
        .select('*');

    if (error) {
        console.error('Error fetching providers:', error);
        return [];
    }
    return data;
}

// Function to display providers
async function displayProviders() {
    const providers = await fetchProviders();
    const providerList = document.getElementById('providerList');
    providerList.innerHTML = ''; // Clear previous results

    providers.forEach(provider => {
        const providerDiv = document.createElement('div');
        providerDiv.className = 'provider';
        providerDiv.innerHTML = `
            <h2>${provider.name}</h2>
            <p>Service Type: ${provider.service_type}</p>
            <p>Description: ${provider.description || 'N/A'}</p>
            <p>Address: ${provider.address || 'N/A'}</p>
            <p>Rating: ${provider.rating || 0} ★</p>
            <button onclick="bookAppointment('${provider.id}')">Book Appointment</button>
        `;
        providerList.appendChild(providerDiv);
    });
}

// Function to handle search
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const providers = await fetchProviders();
    const filteredProviders = providers.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm) || 
        provider.service_type.toLowerCase().includes(searchTerm)
    );
    displayFilteredProviders(filteredProviders);
});

// Function to display filtered providers
function displayFilteredProviders(filteredProviders) {
    const providerList = document.getElementById('providerList');
    providerList.innerHTML = ''; // Clear previous results

    filteredProviders.forEach(provider => {
        const providerDiv = document.createElement('div');
        providerDiv.className = 'provider';
        providerDiv.innerHTML = `
            <h2>${provider.name}</h2>
            <p>Service Type: ${provider.service_type}</p>
            <p>Description: ${provider.description || 'N/A'}</p>
            <p>Address: ${provider.address || 'N/A'}</p>
            <p>Rating: ${provider.rating || 0} ★</p>
            <button onclick="bookAppointment('${provider.id}')">Book Appointment</button>
        `;
        providerList.appendChild(providerDiv);
    });
}

// Function to handle booking an appointment
async function bookAppointment(providerId) {
    const dateTime = prompt("Enter the date and time for your appointment (YYYY-MM-DD HH:MM):");
    if (!dateTime) return;

    const { data: user, error: userError } = await supabase.auth.getUser(); // Get the current user
    if (userError) {
        console.error('Error fetching user:', userError);
        return;
    }

    const { error } = await supabase
        .from('bookings') // Use the actual bookings table name
        .insert([
            {
                user_id: user.id,
                provider_id: providerId,
                service_type: 'Service Type Placeholder', // Replace with actual service type if needed
                date_time: new Date(dateTime).toISOString(),
                status: 'pending'
            }
        ]);

    if (error) {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
    } else {
        alert('Appointment booked successfully!');
    }
}

// Initial display of all providers
displayProviders();
