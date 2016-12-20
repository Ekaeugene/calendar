var calendarApp = angular.module("calendarApp",["ngResource","LocalStorageModule"]);

/* Factory */

calendarApp.factory('Event', [
  '$resource', function($resource) {
    return $resource('events/:year/:month.:format');
  }
]);


calendarApp.controller("CalendarInitCtrl",["$scope","localStorageService",function( $scope, localStorageService ) {


  		var curDate = new Date();
  		var curYear = curDate.getFullYear();
  		var curMonth = curDate.getMonth();
  		var daysInMonth = curDate.daysInMonth();
  		$scope.curMonth = curMonth;


  		var dayCurWeek =  getFirstWeekDay( curYear, $scope.curMonth );
  		var prevMonthWeek = getDaysPrevWeek( curYear, $scope.curMonth , dayCurWeek );
  		var arrayDays = arrayDate( daysInMonth, prevMonthWeek[0], prevMonthWeek[1], dayCurWeek );

  		$scope.countCurMounth = daysInMonth;
  		$scope.year = curYear;
  		$scope.dayCurWeek = dayCurWeek;
  		$scope.month = getCurDate( curDate.getMonth() );
  		$scope.numMonth = curDate.getMonth();
  		$scope.monthCalendar = arrayDays;

  		$scope.getDayWeek = [
			"Воскресенье, ",
			"Понедельник, ",
			"Вторник, ",
			"Среда, ",
			"Четверг, ",
			"Пятница, ",
			"Суббота, "
		];

		$scope.newWeek = function(week) {
			var nextYear = week % 12; 
			
			
			if( (nextYear == 0 || nextYear == undefined) && week > $scope.curMonth) {
				$scope.year++;
			}
			if($scope.month == "Январь" && week < $scope.curMonth) {
				$scope.year--;
				
			}

	  		$scope.curMonth = week;

	  		curDate = new Date($scope.year,week,1);

	  		daysInMonth = curDate.daysInMonth();
	  		dayCurWeek =  getFirstWeekDay( $scope.year, $scope.curMonth );
	  		prevMonthWeek = getDaysPrevWeek( $scope.year, $scope.curMonth , dayCurWeek );
	  		arrayDays = arrayDate( daysInMonth, prevMonthWeek[0], prevMonthWeek[1], dayCurWeek );

	  		$scope.countCurMounth = daysInMonth;
	  	
	  		$scope.dayCurWeek = dayCurWeek;
	  		$scope.month = getCurDate( week );
	  		$scope.numMonth = clearValue( week );

	  		$scope.monthCalendar = arrayDays;

		}
		
  	}]);



calendarApp.controller("EventCtrl",["$scope","Event","localStorageService",function($scope, Event, localStorageService) {

		$scope.changeEventInMonth = function(month,year) {

		$scope.events = "";
		var local = localStorageService.get("calendar_"+month+"_"+year);
		var keyMonth = clearValue(month);
		
		if(local == null) {

			Event.get({year: $scope.year, month:month, format:'json' }, function(data) {
      			localStorageService.set("calendar_"+month+"_"+year, data);	
      			
    		});	
		}
		$scope.events = localStorageService.get("calendar_"+keyMonth+"_"+year);
	}

	
	$scope.eventFilter = function() {
		
		console.log( $scope.search );
		
	}

	$scope.addEvent = function(day, year, month) {
		
		var getLocalStorage = localStorageService.get("calendar_"+month+"_"+year);
		if(getLocalStorage == null) {
			getLocalStorage = {};
		}
		var eventName = $scope.formData.eventName;
		var people = $scope.formData.people;
		var time = $scope.formData.times;
		var descrption = $scope.formData.descrption;
		var key = day.toString();
		var keyMonth = clearValue(month);

		getLocalStorage[key] = {"eventName":eventName,"people":people,"time":time,"descriptions":descrption};
		localStorageService.set("calendar_"+keyMonth+"_"+year, getLocalStorage);

		/*
		$scope.entry = new Event(); 
		$scope.entry.data = 'some data';
		Entry.save($scope.entry, function() {
		    
		 });  */	
	}
	$scope.updateEvent = function( day, year, month ) {

		var getLocalStorage = localStorageService.get("calendar_"+month+"_"+year);
		var key = day.toString();
		getLocalStorage[key].descriptions = $scope.formData.descrption;
		localStorageService.set("calendar_"+month+"_"+year, getLocalStorage);

		/*метод для работы с сервером для обовления контента
		$scope.entry = new Event(); 
		$scope.entry.data = 'some data';
		Entry.save($scope.entry, function() {
		    
		 });  */
	}
	$scope.deleteEvent = function( day, year, month ) {
		var getLocalStorage = localStorageService.get("calendar_"+month+"_"+year);
		var key = day.toString();
		delete getLocalStorage[key];
		localStorageService.set("calendar_"+month+"_"+year, getLocalStorage);

		/*для удаления
		  $scope.entry = Movie.get({ id: $scope.id }, function() {
		  $scope.entry.data = 'something else';
		  $scope.entry.$delete(function() {
		    
		  });*/
	}

}])



calendarApp.directive('nextLevel', ['$compile', '$http' ,function ($compile, $http, ctrl) {
        return {
            restrict: 'EA',
            scope:{ popoverHtml:'@'},
            template: '',
            link: function (scope, el, attrs, ctrl){

              $(el[0]).popover({
                    trigger: 'click',
                    html: true,
                    toggle:'popover',   
                    title: '',
                    content: scope.popoverHtml,  // Access the popoverHtml html
                    placement: 'right'
                });
                
              attrs.$observe('popoverHtml', function(val){
              	if(val == "") {
              		val = '<div class="form-group"><input ng-model="events" type="text" placeholder="событие" class="form-control" id="email"></div><div class="form-group"><input type="text" ng-model="times" placeholder="день,месяц,год"class="form-control" id="pwd"></div><div class="form-group"><input ng-model="names" type="text" placeholder="Имена участников"class="form-control" id="pwd"></div><div class="form-group"><textarea ng-model="descrption" placeholder="Описание"></textarea></div><button type="submit" ng-click="addEvent();" class="btn btn-default">Добавить</button>';

              	}
                $(el[0]).popover('hide');
                var popover = $(el[0]).data('bs.popover');
                 popover.options.content = val;
              })
              
              
            } 
        };   
    }]);


 
Date.prototype.daysInMonth = function() {
	return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

function arrayDate(daysInMonth, dayPrevWeek, allDaysPrevWeek, firstWeekDay) {
	var week = [];
	var j = 0;
	if(firstWeekDay > 0) {
		for (var i = dayPrevWeek; i <= allDaysPrevWeek; i++) 
		{
			week[j] = i;
			j++;
		};
	}
	for (var k = 1; k <= daysInMonth; k++) {
		week[j] = k;
		j++;
	};
	return week;
}
function getFirstWeekDay(currentYear, currentMonth) {
	var firstDay  = new Date( currentYear, currentMonth , 1 );
	return firstDay.getDay();
}
function getDaysPrevWeek(currentYear, currentMonth, dayCurWeek) {
	var dayPrevMonth  = new Date( currentYear, currentMonth, 1  - dayCurWeek );
	var countDaysPrevMonth = dayPrevMonth.daysInMonth();
	return [dayPrevMonth.getDate(),countDaysPrevMonth];
}
function clearValue(month) {
	if( Math.sign(month) == -1 ) {
			console.log(month);
			month = month + 11; 
	}
	if( Math.abs(month) > 11 ) {
		month = Math.abs(month) % 12;
	}
	return month;
}

function getCurDate(month) {

	var key = clearValue(month);
	var months = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь",
	];
	return months[Math.abs(key)];
}