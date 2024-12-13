<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="styles.css">
    <title>NearByNow</title>
</head>
<body>
    <header>
        <h1>NearByNow</h1>
        <input type="text" id="search" placeholder="Search for services..." aria-label="Search for services">
        <button id="searchButton">Search</button>
    </header>
    <main>
        <section id="providerList">
            <!-- Service providers will be dynamically populated here -->
        </section>
    </main>
    <footer>
        <p>&copy; 2023 NearByNow</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
    <script src="app.js"></script>
</body>
</html>
  
