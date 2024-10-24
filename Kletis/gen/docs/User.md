

# User


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**id** | **String** | Unique identifier of the user |  [optional] |
|**username** | **String** | The username of the user |  [optional] |
|**email** | **String** | The email of the user |  [optional] |
|**password** | **String** | The hashed password of the user |  [optional] |
|**createdAt** | **OffsetDateTime** | Timestamp when the user was created |  [optional] |
|**type** | [**TypeEnum**](#TypeEnum) | The type of user (admin, mod, guest) |  [optional] |



## Enum: TypeEnum

| Name | Value |
|---- | -----|
| ADMIN | &quot;admin&quot; |
| MOD | &quot;mod&quot; |
| GUEST | &quot;guest&quot; |



