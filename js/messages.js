var messages = [
       {
           "messageId": 1,
           "from": "kak_sme@abv.bg",
           "topic": "Mnogo gotin tipic",
           "body": "Kak sme kelesh :D",
           "date": "8:49",
           "isNew": true
       },
       {
           "messageId": 3,
           "from": "kak_ne_sme@abv.bg",
           "topic": "Oshte po gotin topic",
           "body": "Kak sme kelesh :D",
           "date": "25.10 8:49",
           "isNew": false
       }
];

var messagesNamespace = {
    
    userMessages: [],
    currentMessage: null,
    referer: null,
            
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
            
    sendMessageAction: function(wrapperId) {
        $("#" + wrapperId).html($("#send-message").html());
        
        $("#footer-list").addClass("hidden");
    },
            
    handleSend: function() {
        document.location = "showMessages.html  ";
    },
    
    replyMessageAction: function(wrapperId) {
        $("#" + wrapperId).html($("#send-message").html());
        
        $("#textinput-reciever").val(this.currentMessage.from);
        $("#textinput-topic").val("Re: " + this.currentMessage.topic);
        
        $("#footer-view").addClass("hidden");
    },
            
    forwardMessageAction: function(wrapperId) {
        $("#" + wrapperId).html($("#send-message").html());
        
        $("#textinput-topic").val(this.currentMessage.topic);
        $("#textarea-body").val(this.currentMessage.body);
        
        $("#footer-view").addClass("hidden");
    },
            
    /* WARNING */        
    /* PRIVATE METHODS BELOW THIS LINE */
    /* DO NOT CALL DIRECTLY */
    getMessage: function(messageId) {
        $.each(this.userMessages, function(index, value) {
            if(parseInt(value.id, 10) === parseInt(messageId, 10)) {
                messagesNamespace.currentMessage = value;
                return false;
            }
        });
        
        if(this.currentMessage !== null) {
            return this.currentMessage; 
        }
    },
    
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
        
        var message = this.getMessage(messageId);
        
        html += "<h2>\
                    " + message.topic + ", " + message.from + "\
                </h2>\
                <h5>\
                    " + message.body + "\
                </h5>";
        
        /* Change footer */
        $("#footer-list").addClass("hidden");
        $("#footer-view").show();
        return html;
    },
            
    renderNewMessage: function() {
        return $("#send-message").html();
    }
};