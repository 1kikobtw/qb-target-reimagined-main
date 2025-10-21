fx_version 'cerulean'
game 'gta5'
lua54 'yes'
use_experimental_fxv2_oal 'yes'
author 'BerkieB'
-- Rework made by 1kiko
description 'Allows players to interact with various objects and entities in the world'
--Changed to hold button to interact base
--Added Scroll to move labels
--Complete UI rework

version '5.5.0'

ui_page 'html/index.html'

client_scripts {
	'@PolyZone/client.lua',
	'@PolyZone/BoxZone.lua',
	'@PolyZone/EntityZone.lua',
	'@PolyZone/CircleZone.lua',
	'@PolyZone/ComboZone.lua',
	'init.lua',
	'client.lua',
}

exports {
	'RaycastCamera',
	'DisableNUI',
	'EnableNUI',
	'LeftTarget',
	'DisableTarget',
	'DrawOutlineEntity',
	'CheckEntity',
	'CheckBones',
	'AddCircleZone',
	'AddBoxZone',
	'AddPolyZone',
	'AddComboZone',
	'AddEntityZone',
	'RemoveZone',
	'AddTargetBone',
	'RemoveTargetBone',
	'AddTargetEntity',
	'RemoveTargetEntity',
	'AddTargetModel',
	'RemoveTargetModel',
	'AddGlobalPed',
	'AddGlobalVehicle',
	'AddGlobalObject',
	'AddGlobalPlayer',
	'RemoveGlobalPed',
	'RemoveGlobalVehicle',
	'RemoveGlobalObject',
	'RemoveGlobalPlayer',
	'IsTargetActive',
	'IsTargetSuccess',
	'GetGlobalTypeData',
	'GetZoneData',
	'GetTargetBoneData',
	'GetTargetEntityData',
	'GetTargetModelData',
	'GetGlobalPedData',
	'GetGlobalVehicleData',
	'GetGlobalObjectData',
	'GetGlobalPlayerData',
	'UpdateGlobalTypeData',
	'UpdateZoneData',
	'UpdateTargetBoneData',
	'UpdateTargetEntityData',
	'UpdateTargetModelData',
	'UpdateGlobalPedData',
	'UpdateGlobalVehicleData',
	'UpdateGlobalObjectData',
	'UpdateGlobalPlayerData',
	'SpawnPeds',
	'DeletePeds',
	'SpawnPed',
	'RemoveSpawnedPed',
	'AllowTargeting'
}

files {
	'data/*.lua',
	'html/*.html',
	'html/css/*.css',
	'html/js/*.js'
}

dependency 'PolyZone'
