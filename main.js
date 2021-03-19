

let start = '05/09/2011';
let end = '05/12/2011';
let data = [];
let microblogMap;
let timeLine;
let coallocationList;
let timeLineData = 
$('body').on('submit', '.my-form', mySubmitFunction);

function mySubmitFunction(e) {
    e.preventDefault();
}

document.addEventListener('DOMContentLoaded', function() {

    $.getJSON('cse557_option1_microblogs.json', (jsonData) => {
        data = jsonData;
        timeLine = new Timeline("timeline", [])
        microblogMap = new MicroblogMap("map", timeLine, jsonData, 'cse557_option1_sick_microblogs_sampled.json', start, end);
       
    })
    $.getJSON('collocations_by_day.json', (data)=> {
        coallocationList = new coallocationScreen("bigram-lister", data, start, end )
    })

    $(function() {

        $('#dataset').on('change', function() {
            let newFile = this.value
            microblogMap.changeDataSet(newFile)
          });

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
            microblogMap.changeMapForDate(start, end);
            coallocationList.getNewDateAndUpdate(start, end)

        });
      
        $('input[name="datetimes"]').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
      
      });
  
  }, false);



