

// microblogMap = new MicroblogMap("map", data);

// $(function() {
//     $('input[name="datetimes"]').daterangepicker({
//       timePicker: true,
//       startDate: moment().startOf('hour'),
//       endDate: moment().startOf('hour').add(32, 'hour'),
//       locale: {
//         format: 'M/DD hh:mm A'
//       }
//     });
//   });

document.addEventListener('DOMContentLoaded', function() {
    // do stuff here

    $('input[name="datetimes"]').daterangepicker();

    $.getJSON('cse557_option1_microblogs.json', (jsonData) => {
        data = jsonData;
        console.log(jsonData);
        microblogMap = new MicroblogMap("map", jsonData);
    });
  
  }, false);



