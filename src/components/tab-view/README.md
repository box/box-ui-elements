### Examples

#### Tabs
```
const Tab = require('./Tab').default;

<TabView defaultSelectedIndex={ 1 }>
    <Tab title="Item 1">
        All these journalists can give their opinions well these are mine…yes I believe in my ripped homeless sweaters!!! I have so much love in my heart and we just need the shot to create live breathe. What do you mean by @JustinBieber was my favorite song of 2015 I thank Olivier for designing his collection around my wife… this is visionary as I believe that Kim is our modern day everything.
    </Tab>
    <Tab title="Item 2">
        I also hate all the stylists that copy Hedi Slimane and give their clients blatant YSL looks thinking that it will bring a younger client. Pablo did 250 Million... This is not regular! daytime Olivier designed clothes for my show… That was real, that was groundbreaking, that is a Real Friend.
    </Tab>
</TabView>
```

#### Tabs with onTabSelect callback
```
const Tab = require('./Tab').default;

const cb = (selectedIndex) => alert(selectedIndex);

<TabView defaultSelectedIndex={ 1 } onTabSelect={ cb }>
    <Tab title="Item 1">
        All these journalists can give their opinions well these are mine…yes I believe in my ripped homeless sweaters!!! I have so much love in my heart and we just need the shot to create live breathe. What do you mean by @JustinBieber was my favorite song of 2015 I thank Olivier for designing his collection around my wife… this is visionary as I believe that Kim is our modern day everything.
    </Tab>
    <Tab title="Item 2">
        I also hate all the stylists that copy Hedi Slimane and give their clients blatant YSL looks thinking that it will bring a younger client. Pablo did 250 Million... This is not regular! daytime Olivier designed clothes for my show… That was real, that was groundbreaking, that is a Real Friend.
    </Tab>
</TabView>
```
#### Tabs With Link
```
const Tab = require('./Tab').default;

<TabView defaultSelectedIndex={ 0 }>
    <Tab title="Item 1">
        All these journalists can give their opinions well these are mine…yes I believe in my ripped homeless sweaters!!! I have so much love in my heart and we just need the shot to create live breathe. What do you mean by @JustinBieber was my favorite song of 2015 I thank Olivier for designing his collection around my wife… this is visionary as I believe that Kim is our modern day everything.
    </Tab>
    <Tab href='https://www.box.com/' title='Box.com' />
</TabView>
```
#### Dynamic Tabs With Link
```
const Tab = require('./Tab').default;

<TabView defaultSelectedIndex={ 0 } isDynamic>
    <Tab href='https://www.box.com/' title='Box.com 1' />
    <Tab href='https://www.box.com/' title='Box.com 2' />
    <Tab href='https://www.box.com/' title='Box.com 3' />
    <Tab href='https://www.box.com/' title='Box.com 4' />
    <Tab href='https://www.box.com/' title='Box.com 5' />
    <Tab href='https://www.box.com/' title='Box.com 6' />
    <Tab href='https://www.box.com/' title='Box.com 7' />
    <Tab href='https://www.box.com/' title='Box.com 8' />
    <Tab href='https://www.box.com/' title='Box.com 9' />
    <Tab href='https://www.box.com/' title='Box.com 10' />
    <Tab href='https://www.box.com/' title='Box.com 11' />
    <Tab href='https://www.box.com/' title='Box.com 12' />
    <Tab href='https://www.box.com/' title='Box.com 13' />
    <Tab href='https://www.box.com/' title='Box.com 14' />
    <Tab href='https://www.box.com/' title='Box.com 15' />
    <Tab href='https://www.box.com/' title='Box.com 16' />
</TabView>
```

#### Dynamic Tabs
```
const Tab = require('./Tab').default;

<TabView defaultSelectedIndex={ 7 } isDynamic={true}>
    <Tab title="Item with very long name 1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean enim eros, ultrices at risus vel, mollis venenatis massa. Ut tincidunt venenatis turpis. Ut lacinia tellus eu mauris luctus rhoncus. Curabitur bibendum orci ac sem ultricies, in vulputate lectus sodales. Duis eleifend consequat dictum. Vestibulum et ligula urna. Vivamus dignissim bibendum laoreet. Nunc dictum, felis nec suscipit porta, justo mauris cursus quam, vel interdum ex dui et orci. Suspendisse ac risus augue. Mauris condimentum eu lectus quis venenatis.
    </Tab>
    <Tab title="Item with another very long name 2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue mi mi, et consequat nisi finibus nec. Aliquam eget efficitur dolor. Sed elit libero, euismod ac orci nec, convallis lobortis augue. Praesent commodo bibendum dui venenatis lobortis. In finibus molestie libero, sed euismod massa sodales fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed faucibus magna vel vulputate interdum. Ut fermentum gravida lorem vitae aliquet. Aenean placerat gravida eleifend.
    </Tab>
    <Tab title="Item with another very very long name 3">
        Quisque molestie pharetra aliquet. Nunc ac tempus lacus. Nulla tincidunt metus sed quam finibus, sed mollis sem vestibulum. Maecenas sapien est, maximus vel maximus at, vestibulum quis sem. Vestibulum ut tortor eget tellus luctus pretium. In hac habitasse platea dictumst. Nam ac tellus nec dui scelerisque pulvinar. Curabitur dignissim nunc nulla, eget fringilla sem condimentum quis. Sed nec lectus erat. Integer ut vehicula enim, in scelerisque dolor. Sed pharetra metus sit amet urna posuere, maximus sollicitudin lacus mattis. Nunc placerat ullamcorper est ut auctor.
    </Tab>
    <Tab title="Item with another very very very long name 4">
        Proin vitae orci ac erat efficitur ornare. Aliquam non tincidunt neque. Aenean sollicitudin nibh at nulla facilisis luctus. Nam euismod purus in nulla dapibus ullamcorper eu vitae enim. Aenean eget nisi at enim interdum sollicitudin ut et libero. Morbi volutpat fringilla purus nec euismod. Morbi massa leo, aliquam ut nisl at, consectetur tristique massa. Nunc et libero quam. Donec viverra nisl sed urna mollis, ac euismod urna suscipit. Aliquam ultricies vitae nulla ac venenatis. Sed rutrum leo in purus lacinia pellentesque. Phasellus dictum ex a ultrices ornare.
    </Tab>
    <Tab title="Item 5">
        Aliquam in ullamcorper nisl. Proin condimentum ante eget venenatis euismod. Aliquam congue facilisis ligula nec egestas. Cras hendrerit placerat dui sit amet pellentesque. Donec et risus et massa gravida pretium a nec nulla. Sed mollis ligula varius egestas ultricies. In consequat mauris dapibus odio convallis congue. Nullam mauris nisi, vehicula non turpis quis, pulvinar elementum mi. Duis eget consectetur velit, ullamcorper porttitor enim. Nulla vel suscipit risus. Mauris imperdiet justo odio, quis auctor magna condimentum sit amet.
    </Tab>
    <Tab title="Item 6">
        Mauris non eleifend tellus, non luctus enim. Phasellus scelerisque, lorem in commodo vulputate, metus nisl hendrerit justo, vel consequat diam est a felis. Suspendisse mollis pretium ante quis fermentum. Nam porttitor turpis id nisl gravida malesuada. Proin commodo velit est, lobortis viverra metus interdum ac. Sed molestie gravida imperdiet. Nullam nec eros commodo, malesuada eros eget, venenatis purus. Nulla varius nulla eget neque ullamcorper, nec eleifend sapien bibendum. Donec urna enim, dapibus in cursus feugiat, hendrerit pellentesque diam. Duis in tortor mi. Suspendisse potenti. Etiam imperdiet, justo et luctus interdum, dui purus blandit justo, et gravida nulla tellus non turpis. Nullam varius dui vitae nibh condimentum, eget varius turpis sagittis. Nam ut sapien tincidunt, posuere tellus quis, imperdiet leo. Nam feugiat semper ultrices. Nulla placerat risus eleifend cursus dapibus.
    </Tab>
    <Tab title="Item 7">
        Nullam sapien diam, molestie non malesuada ut, congue vel magna. Maecenas malesuada nisi ligula, hendrerit eleifend turpis mattis quis. Nunc vitae condimentum neque. Mauris dui ex, facilisis id risus at, efficitur sodales urna. Ut cursus neque sed lacinia bibendum. Mauris eget sem vel enim pellentesque aliquam et volutpat nisl. Phasellus ac pharetra ante. Sed sit amet turpis justo. Ut varius, ipsum eu mattis malesuada, mauris enim scelerisque turpis, eu tempor nunc arcu id tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lacus sem, molestie ut dignissim eget, sollicitudin in arcu. Donec non vestibulum magna.
    </Tab>
    <Tab title="Item 8">
        Sed at leo ut sapien semper tincidunt. <a href="#TabView">Phasellus</a> sed arcu luctus, <input type="text" />maximus elit sed, gravida ipsum. Sed tempor diam in arcu posuere tempus. Maecenas id mollis mi, eget imperdiet neque. Nulla facilisi. Maecenas fermentum suscipit accumsan. Maecenas scelerisque sem et auctor eleifend. In eget metus lacus. Donec aliquam velit augue, ac condimentum turpis dapibus non. Duis dictum luctus dapibus. Nunc vitae libero id augue lacinia pharetra. Integer euismod nulla in tellus cursus, vel luctus lorem tristique. Aenean posuere elit nec velit tincidunt tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc posuere ipsum nec dapibus placerat. Suspendisse tristique fermentum eros laoreet elementum.
    </Tab>
    <Tab title="Item 9">
        Vestibulum egestas, neque vestibulum auctor dapibus, tellus tellus euismod est, in mattis sem neque ornare mi. Fusce accumsan, nisl a mattis egestas, dui felis bibendum est, non imperdiet massa eros sit amet nunc. Nam ipsum felis, commodo sit amet ullamcorper in, accumsan a nulla. Donec massa nulla, porttitor sit amet leo vel, scelerisque tincidunt sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc cursus tortor eget tempor malesuada. Suspendisse sit amet tincidunt ipsum. Aenean non est non elit porttitor convallis. Nulla in elit risus. Aliquam posuere non risus vel blandit. Nullam vitae lacus pellentesque, bibendum nibh eu, varius velit. Nunc at aliquam velit, sed ornare neque. Duis odio ante, consequat a finibus aliquet, dapibus at urna.
    </Tab>
</TabView>
```
