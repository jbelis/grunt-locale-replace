(function () {
	var i18n = {};
	var MessageFormat = {locale: {}};

	MessageFormat.locale.en=function(n){return n===1?"one":"other"}

	var
		c=function(d){if(!d)throw new Error("MessageFormat: No data passed to function.")},
		n=function(d,k,o){if(isNaN(d[k]))throw new Error("MessageFormat: `"+k+"` isnt a number.");return d[k]-(o||0)},
		v=function(d,k){c(d);return d[k]},
		p=function(d,k,o,l,p){c(d);return d[k] in p?p[d[k]]:(k=MessageFormat.locale[l](d[k]-o),k in p?p[k]:p.other)},
		s=function(d,k,p){c(d);return d[k] in p?p[d[k]]:p.other};

	i18n["\x3ci class=\x22fa fa-check\x22\x3e\x3c/i\x3e Changement en attente de vérification.  Vérifiez votre boite aux lettres!"] = "\x3ci class=\x22fa fa-check\x22\x3e\x3c/i\x3e A confirmation email was sent to you. please check your inbox";

	i18n["\x3ci class=\x22fa fa-remove\x22\x3e\x3c/i\x3e L\x27addresse %%=requestedEmail=%% appartient a un autre utilisateur"] = "\x3ci class=\x22fa fa-remove\x22\x3e\x3c/i\x3e The address %%=requestedEmail=%% belongs to another user";

	i18n["\x3ci class=\x22fa fa-remove\x22\x3e\x3c/i\x3e La demande de changement a échoué"] = "\x3ci class=\x22fa fa-remove\x22\x3e\x3c/i\x3e The change request has failed";

	i18n["Email"] = "Email address";

	i18n["Entreprise"] = "Company";

	i18n["[modifier]"] = "[change]";

	return i18n;
})();
