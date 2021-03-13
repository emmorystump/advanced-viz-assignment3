
data = []

// microblogMap = new MicroblogMap("map", data);

$.getJSON('cse557_option1_microblogs.json', (jsonData) => {
    data = jsonData;
    console.log(jsonData);
    microblogMap = new MicroblogMap("map", jsonData);
});

