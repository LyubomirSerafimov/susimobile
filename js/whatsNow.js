var whatsNowNamespace = {
    
    year: "year1",
    semester: 0,
    group: 1,
    
    programData: null,
    
    init: function(data) {
        this.programData = data;
    },
    
    whatsNowAction: function(wrapperId) {
        $("#" + wrapperId).html(whatsNowNamespace.renderWhatsNowList());
    },
    
    /* PRIVATE */
    getData: function(callback) {
        $.getJSON("data/program_cs.json", function(data){
            callback(data[whatsNowNamespace.year]['flows'][whatsNowNamespace.semester]);
            return false;
        });
    },
            
    renderWhatsNowList: function() {
        var a = new Date();
        var day = a.getDay();
        var customData = [];
        
        switch(day) {
            case 0:
                customData = this.programData[this.year]['flows'][this.semester]['sunday'];
                break;
            case 1:
                customData = this.programData[this.year]['flows'][this.semester]['monday'];
                break;
            case 2:
                customData = this.programData[this.year]['flows'][this.semester]['tuesday'];
                break;
            case 3:
                customData = this.programData[this.year]['flows'][this.semester]['wednesday'];
                break;
            case 4:
                customData = this.programData[this.year]['flows'][this.semester]['thursday'];
                break;
            case 5:
                customData = this.programData[this.year]['flows'][this.semester]['friday'];
                break;
            case 6:
                customData = this.programData[this.year]['flows'][this.semester]['saturday'];
                break;
            default:
                customData = [];
        }
        
        if(typeof customData === 'undefined') {
            customData = [];
        }
        
        var html = '';
        
        var currentMineLectures = this.parseCurrentMineLectures(customData);
        
        var currentOtherLectures = this.parseCurrentOtherLectures(customData);
        
        html += whatsNowNamespace.renderList('В момента имам', currentMineLectures);
        
        html += whatsNowNamespace.renderList('Други дисциплини', currentOtherLectures);
        
        return html;
    },
            
    parseCurrentMineLectures: function(data) {
        if(data.length === 0) {
            return [];
        }
        
        var currentData = data['groups'][this.group];
        var proccesedData = [];
        
        var a = new Date();
        var hour = a.getHours();
        
        $.each(currentData, function(index, value) {
            if(hour >= value['start'] && hour < value['end']) {
                proccesedData.push(value);
            }
        });
        
        return proccesedData;
    },
            
    parseCurrentOtherLectures: function(data) {
        if(data.length === 0) {
            return [];
        }

        var currentData = data['groups'];
        var proccesedData = [];
        
        var a = new Date();
        var hour = a.getHours();
        
        $.each(currentData, function(index, value) {
            if(index !== whatsNowNamespace.group) {
                $.each(value, function(index, value) {
                    if(hour >= value['start'] && hour < value['end']) {
                        proccesedData.push(value);
                    }
                });
            }
        });
        
        return proccesedData;
    },
            
    renderList: function(title, data) {
        if(data.length === 0) {
            return "<ul data-role=\"listview\" data-divider-theme=\"b\" data-inset=\"true\">\
            <li data-role=\"list-divider\" role=\"heading\">\
                " + title + "\
            </li>\
            <li data-theme=\"c\">\
            Няма текущи дисциплини\
            </li>";
        }
        
        var html = "";
        
        html += "<ul data-role=\"listview\" data-divider-theme=\"b\" data-inset=\"true\">\
            <li data-role=\"list-divider\" role=\"heading\">\
                " + title + "\
            </li>";
        
        $.each(data, function(index, data) {
            if(typeof data.teacher === "undefined") {
                data.teacher = 'Не е въведен'
            }
            
            var description = data.teacher + " времетраене: " + data.start + "-" + data.end + " ст. " + data.room;
            
            html += "<li data-theme=\"c\">\
                            " + data.label + "<br />\
                            <span style=\"font-size: 0.6em; overflow: hidden; padding-left:10px;\">" + description + "</span>\
                    </li>"
        });
    
            html += "</ul>"
                
        
        return html;
    }
};