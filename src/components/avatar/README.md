### Examples
**Initials**
```
    <div>
        <Avatar id={ 1 } name='Aaron Levie' />
        <Avatar id={ 2 } name='Front End' />
        <Avatar id={ 3 } name='Redwood City' />
    </div>
```

**AvatarUrl**
```
    <div>
        <Avatar id={ 1 } name='Aaron Levie' avatarUrl='https://pbs.twimg.com/profile_images/885529357904510976/tM0vLiYS_400x400.jpg' />
    </div>
```

**AvatarUrl fallback to initials (404)**
```
    <div>
        <Avatar id={ 1 } name='Aaron Levie' avatarUrl='https://pbs.twimg.com/profile_images/885529357904510976/tM0vLiYS_400x400.jpg_invalid' />
    </div>
```

**Avatar with no name/URL (Anonymous User)**
```
    <div>
        <Avatar />
    </div>
```

**Image**
```
// @NOTE: Although this is a simple example, I'm writing it in a JS file and requiring
// it here because the PNG image is huge, don't really want to blow up our package size.

const AvatarImageExample = require('examples').AvatarImageExample;

<AvatarImageExample />
```

