var messages = [
       {
           "messageId": 1,
           "from": "kak_sme@abv.bg",
           "topic": "asdasdasdsasd",
           "body": "Kak sme kelesh :D",
           "date": "8:49",
           "isNew": true
       },
       {
           "messageId": 3,
           "from": "kak_ne_sme@abv.bg",
           "topic": "asdasdasdsasd",
           "body": "Kak sme kelesh :D",
           "date": "25.10 8:49",
           "isNew": false
       }
];

var messagesNamespace = {
    
    userMessages: [],
    
    Message: function(data) {
        var instance = Object();

        instance.classId = 'Message';
        instance.href = "";
        

        if(typeof data === 'object') {
            instance.id = data.messageId;
            instance.from = data.from;
            instance.topic = data.topic;
            instance.body = data.body;
            instance.date = data.date;
            instance.isNewMessage = data.isNew;
            
            instance.href = "#" + instance.id;
        } else {
            instance.id = null;
            instance.from = '';
            instance.topic = '';
            instance.date = '';
            instance.body = '';
            instance.isNewMessage = true;
        }
        
        instance.isNew = function() {
            return this.isNewMessage;
        };
        
        instance.toHtml = function() {
            
            var onClick = "messagesNamespace.viewMessageAction(\'content\', \'" + instance.id + "\');";
            
            var link = "<a href=\"" + instance.href + "\" data-transition=\"slide\" onclick=\"javascript:" + onClick + "\">";
            
            var fromSpan = "<span style=\"font-size: 0.6em; overflow: hidden;\">" + instance.from + "</span>";
            var topicSpan = "<span style=\"font-size: 0.6em; overflow: hidden;\">" + instance.topic + "</span>";
            var dateSpan = "<span class=\"ui-li-count\">" + instance.date + "\</span>";
            
            var html = link + "<div>" + fromSpan + "<br />" + topicSpan + "</div>" + dateSpan;
            
            return html;
        };
        
        return instance;
    },
    
    init: function() {
        this.parseMessages(messages);
    },
    
    showMessagesAction: function(wrapperId) {
        $("#" + wrapperId).html(this.renderMessagesList());
    },
    
    viewMessageAction: function(wrapperId, messageId) {
        $("#" + wrapperId).html(this.renderMessage(messageId));
    },
            
    /* WARNING */        
    /* PRIVATE METHODS BELOW THIS LINE */
    /* DO NOT CALL DIRECTLY */
    parseMessages: function(messages) {
        $.each(messages, function(index, value) {
            messagesNamespace.userMessages.push(messagesNamespace.Message(value));
        });
    },
            
    renderMessagesList: function() {
        var html = "";
        
        var wrapper = "<ul data-role=\"listview\" data-divider-theme=\"b\" data-inset=\"true\">";
        var wrapperTerminator = "</ul>";
        
        var headlineList = "<li data-role=\"list-divider\" role=\"heading\">Inbox</li>";

        html += wrapper + headlineList;

        $.each(this.userMessages, function(index, value) {
            if(value.isNew()) {
                html += "<li data-theme=\"c\" style=\"background: #d3d2d9;\">";
            } else {
                html += "<li data-theme=\"c\">";
            }
            
            html += value.toHtml();
            html += "</li>";
        });
        
        html += wrapperTerminator;
        
        return html;
    },
            
    renderMessage: function(messageId) {
        var html = "";
        
        
        
    },
            
    renderNewMessage: function() {
        return $("#send-message").html();
    }
};