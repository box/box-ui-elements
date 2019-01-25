### Examples
**Relative timestamps**
```
const msInADay = 24*60*60*1000;
const oneHourInMs = 60*60*1000;
<div>
    <div>
        <ReadableTime
            timestamp={Date.now() - oneHourInMs + 30*60*1000}
            relativeThreshold={oneHourInMs}
        />
    </div>
    <div>
        <ReadableTime
            timestamp={Date.now() - 2 * oneHourInMs}
            relativeThreshold={oneHourInMs}
        />
    </div>
    <div>
        <ReadableTime
            timestamp={Date.now() - msInADay}
            relativeThreshold={oneHourInMs}
        />
    </div>
</div>
```

**Date without time**
```
const msInADay = 24*60*60*1000;
const oneHourInMs = 60*60*1000;
<ReadableTime
    timestamp={Date.now() - 7 * msInADay}
    relativeThreshold={oneHourInMs}
/>
```

**Date with time**
```
const msInADay = 24*60*60*1000;
const oneHourInMs = 60*60*1000;
<ReadableTime
    timestamp={Date.now() - 7 * msInADay}
    relativeThreshold={oneHourInMs}
    alwaysShowTime={true}
/>
```

**Date in the future when not allowed**
```
const msInADay = 24*60*60*1000;
const oneHourInMs = 60*60*1000;
<ReadableTime
    timestamp={Date.now() + 7 * msInADay}
    relativeThreshold={oneHourInMs}
    allowFutureTimestamps={false}
/>
```