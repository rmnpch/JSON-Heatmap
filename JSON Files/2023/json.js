let obj = {}
fetch('2023_APRIL.json')
    .then(response => response.json())
    .then (data=>obj=data)

