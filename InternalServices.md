# Instance - Services #


|Operations|Description|
|:---------|:----------|
|Create    |Create an instance according either form the owner field dataType or the given cast dataType|
|Edit      |Backup the current instance (see cancel edition)|
|Update    |Update the current instance values with the given instance and remove the backuped instance (if any)|
|Append to collection|Append the current instance to the given collection (owner and ownerField)|
|Remove from collection|Remove the current instance from the given collection (owner and ownerField)|
|Delete    | Delete the current instance |
|Cancel Edition| Restore the backuped instance to the current instance |
|Deep copy From Source Instance| Copy all field recursively (deep) of the given source instance to the current instance |




# User Level Requirement - Services #

|Operations|Description|
|:---------|:----------|
|Administrator| Current user should have administrator level membership (level <= 1) |
|Editor    | Current user should have editor level membership (level <= 5) |
|Member    | Current user should have member level membership (level <= 10) |
|User      |Current session has been authenticated with an account|
|Captcha   |Current session has been validated with a captcha|
|Owner     |Current instance has 'ownerUser' field and current user is this owner|
|Has View Level|Current instance has 'viewLevel' field and current member has level greater or equal|