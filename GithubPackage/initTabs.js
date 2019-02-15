init: function() {
	this.callParent(arguments);
	this.subscribeSandboxEvents();
},

onEntityInitialized: function()
{
	this.callParent(arguments);
	this.changeIndexOfTimelineTab();
	this.initTabs();
	this.initTerrasoftAccountId();
},

initTerrasoftAccountId: function() {
	Terrasoft.SysSettings.querySysSettingsItem("CgrTerrasoftAccount", function(item) {
		this.set("TerrasoftAccountId", item.value);
	}, this);
},

initTabs: function() {
	var tabsCollection = this.get("TabsCollection");
	var NeedInfoTabVariable = tabsCollection.contains("NeedInfoTab")
	? tabsCollection.get("NeedInfoTab") : false; // вкладка "Презентации"
	var DealSpecificsTab = tabsCollection.contains("DealSpecificsTab")
	? tabsCollection.get("DealSpecificsTab") : false; // вкладка "Комерческие предложения"
	
	if(this.get("QualifyStatus") === undefined)
	{
		return;
	}
	
	if (this.get("QualifyStatus").value === CgrCrmGuruConstants.QualifyStatuses.Qualification)
	{
		
		if (NeedInfoTabVariable) {
			Terrasoft.Lead.NeedInfoTab = NeedInfoTabVariable;
			tabsCollection.removeByKey("NeedInfoTab");
		}
		if(DealSpecificsTab) {
			Terrasoft.Lead.DealSpecificsTab = DealSpecificsTab;
			tabsCollection.removeByKey("DealSpecificsTab");
		}
		this.setActiveTab("GeneralInfoTab"); 
		this.set("GeneralInfoTab", true);
		return;
	}
	else if (this.get("QualifyStatus").value === CgrCrmGuruConstants.QualifyStatuses.Presentation)
	{
		if (!NeedInfoTabVariable) {
			tabsCollection.insert(1, "NeedInfoTab", Terrasoft.Lead.NeedInfoTab);
		}
		if(DealSpecificsTab) {
			Terrasoft.Lead.DealSpecificsTab = DealSpecificsTab;
			tabsCollection.removeByKey("DealSpecificsTab");
		}
		this.setActiveTab("NeedInfoTab");
		this.set("NeedInfoTab", true);
		return;
	}
	else if (this.get("QualifyStatus").value === CgrCrmGuruConstants.QualifyStatuses.CommertialPropose
	|| this.get("QualifyStatus").value === CgrCrmGuruConstants.QualifyStatuses.Conversation
	|| this.get("QualifyStatus").value === CgrCrmGuruConstants.QualifyStatuses.Contracting)
	{
		if (!DealSpecificsTab) {
			tabsCollection.insert(2, "DealSpecificsTab", Terrasoft.Lead.DealSpecificsTab);
		}
		if (!NeedInfoTabVariable) {
			tabsCollection.insert(1, "NeedInfoTab", Terrasoft.Lead.NeedInfoTab);
		}
		this.setActiveTab("DealSpecificsTab");
		this.set("DealSpecificsTab", true);
		return;
	}
	else if (this.get("QualifyStatus").value === CgrCrmGuruConstants.QualifyStatuses.SuccessfulFinish)
	{
		if (!NeedInfoTabVariable) {
			tabsCollection.insert(1, "NeedInfoTab", Terrasoft.Lead.NeedInfoTab);
		}
		if (!DealSpecificsTab) {
			tabsCollection.insert(2, "DealSpecificsTab", Terrasoft.Lead.DealSpecificsTab);
		}
		this.setActiveTab("TimelineTab");
		this.set("TimelineTab", true);
		return;
	}
},