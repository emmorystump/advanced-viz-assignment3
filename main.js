

// microblogMap = new MicroblogMap("map", data);

start = '05/09/2011';
end = '05/12/2011';
data = [];

console.log("hiya");

$('body').on('submit', '.my-form', mySubmitFunction);

function mySubmitFunction(e) {
    e.preventDefault();  // This should really be the first line

    // Other logic
}

document.addEventListener('DOMContentLoaded', function() {

    $.getJSON('cse557_option1_microblogs.json', (jsonData) => {
        data = jsonData;
        console.log(jsonData);
        console.log("here");
        microblogMap = new MicroblogMap("map", jsonData, start, end);
        console.log("in here");
    });

    // $('input[name="datetimes"]').daterangepicker();
    $(function() {

        $('input[name="datetimes"]').daterangepicker({
            autoUpdateInput: false,
            startDate: '05/09/2011', 
            endDate: '05/12/2011',
            locale: {
                cancelLabel: 'Cancel'
            }
        });
      
        $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
            start = picker.startDate.format('MM/DD/YYYY');
            end = picker.endDate.format('MM/DD/YYYY');
            microblogMap.updateVis(start, end);

        });
      
        $('input[name="datetimes"]').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
      
      });
  
  }, false);



