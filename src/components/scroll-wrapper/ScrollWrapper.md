### Description

This is a basic wrapper component that handles functionality to show/hide shadows along the vertical edges. This kicks in once the container's size is smaller than the overall height of the content within.

## Examples

### Specify a fixed height for the wrapper which may force scroll

```js
const ScrollWrapper = require('./ScrollWrapper').default;
<div style={{ height: '500px' }}>
    <ScrollWrapper>
        <div
            style={{
                height: '600px',
                backgroundColor: '#f0f0f0',
            }}
        >
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime accusamus dolorum nostrum itaque ullam
                tempora quam dolore adipisci atque velit, excepturi veniam? Nesciunt non facilis, quos odit aliquam
                alias unde hic quidem exercitationem perspiciatis!
            </p>
            <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet sapiente ipsam, ipsum similique ea
                nemo doloremque. Corporis excepturi eos impedit dicta quidem soluta culpa at delectus est, provident
                vitae sed commodi inventore quaerat non labore consequatur nisi quisquam obcaecati, reprehenderit quas
                dolore ipsa. Totam dolorem suscipit amet optio.
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo dicta cupiditate officiis temporibus
                explicabo!
            </p>
        </div>
    </ScrollWrapper>
</div>;
```

### The wrapper will flow normally if the there are no size constraints around it

```js
const ScrollWrapper = require('./ScrollWrapper').default;

<ScrollWrapper>
    <div
        style={{
            backgroundColor: '#f0f0f0',
        }}
    >
        <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime accusamus dolorum nostrum itaque ullam
            tempora quam dolore adipisci atque velit, excepturi veniam? Nesciunt non facilis, quos odit aliquam alias
            unde hic quidem exercitationem perspiciatis!
        </p>
        <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet sapiente ipsam, ipsum similique ea nemo
            doloremque. Corporis excepturi eos impedit dicta quidem soluta culpa at delectus est, provident vitae sed
            commodi inventore quaerat non labore consequatur nisi quisquam obcaecati, reprehenderit quas dolore ipsa.
            Totam dolorem suscipit amet optio.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo dicta cupiditate officiis temporibus
            explicabo!
        </p>
    </div>
</ScrollWrapper>;
```
