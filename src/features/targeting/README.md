### Description
Model to providing Targeting Feature that exports:
1. MessageContextProvider(MessagaeApi) to provide context
2. useSetEligibleMessageIDMap hook to send provide message to context
3. useMessage hook to get TargetingApi for the message

Please check the test for an example

### Special Note
It is intentional that only MessageApi, TargetingApi, MessageContextProvider, 
useMessage, useSetEligibleMessageIDMap are exported, because the internal datastructure of the 
context value is not exposed to user, and user should call hooks to use TargetingApi.
