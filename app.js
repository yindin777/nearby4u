// Initialize Supabase
const { createClient } = supabase;
const supabaseUrl = 'YOUR_SUPABASE_URL'; // This will be set in your environment variables
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // This will be set in your environment variables
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

    const { user } = await supabase.auth.getUser(); // Get the current user
    if (!user
    
