### Examples

** Basic **

This can be a drop-in replacement for react-intl's FormattedHTMLMessage component:

```jsx
<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
    defaultMessage="English text to translate here"
/>
```

Note that the id and description are required and along with the defaultMessage, they are similar
to the parameters of FormattedHTMLMessage. The difference comes when you nest components in the
defaultMessage.

** With Subcomponents **

JSX components can be nested inside of the defaultMessage, which is something you cannot do
with FormattedHTMLMessage:

```jsx
<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
    defaultMessage={<span class="foo">English <b>text</b> with <Link href="some://url">subcomponents</Link> in the middle of it.</span>}
/>
```

Children components in the body of the FormattedCompMessage are treated the same as a defaultMessage prop. Exactly one of
children or the defaultMessage prop must be specified. The above is equivalent to this:

```jsx
<FormattedCompMessage id="unique.id" description="description for translators to explain the context of this string">
    <span class="foo">
        English <b>text</b> with <Link href="some://url">subcomponents</Link> in the middle of it.
    </span>
</FormattedCompMessage>
```

** Strings to Translate **

Components and HTML in the source string are hidden from the translator, so changing the contents of those tags does
not cause a retranslation, and the translator does not have the ability to change the tag or introduce an injection attack.

The components and HTML are hidden by transforming them into simple XML tags of the form "c" + a digit. The translator would
see the following string to translate for the last example above:

```json
[
  {
    "id": "unique.id",
    "description": "description for translators to explain the context of this string",
    "defaultMessage": "English <c0>text</c0> with <c1>subcomponents</c1> in the middle of it."
  },
]
```

Note that the surrounding span tag and the leading and trailing whitespace are left out so that a minimal string is sent
for translation. These missing parts will be re-introduced later in the render method after the translation is loaded.

The translation must contain the same tags as the source (a c0 and a c1 tag), and it is up to the translator to place
the c0 and c1 tags in the appropriate place for the grammar of their target language.

Let's say the above text was translated to German and the following translation was put back into the code:

```json
[
  {
    "id": "unique.id",
    "description": "description for translators to explain the context of this string",
    "defaultMessage": "Deutscher <c0>Text</c0> mit <c1>Unterkomponenten</c1> in der Mitte."
  },
]
```

The FormattedCompMessage component will decompose the German translation by first transforming the string into an abstract
syntax tree. From there, the c0 and c1 nodes are then replaced with React elements from the source tree. FormattedCompMessage
then clones the source React elements that c0 and c1 represent to create a React element tree for the translation:

```json
{
    type: "span",
    attributes: {
        "class": "foo"
    },
    children: [
        "\n        ",
        "Deutscher ",
        {
            type: "b",
            children: [
                "Text"
            ]
        }
        " mit ",
        {
            type: "Link",
            attributes: {
                "href": "some://url"
            },
            children: [
                "Unterkomponenten"
            ]
        },
        " in der Mitte.",
        "\n    "
    ]
}
```

Notice that the outer span tag and the leading and trailing whitespace are re-introduced into the tree unmodified, and
the React elements created by the translation are sandwiched between them.

Finally, the `render` method renders that React element tree into actual HTML to send to the browser:

```html
<span x-resource-id="unique.id">
    <span>
        Deutscher <b>Text</b> mit <a href="some://url">Unterkomponenten</a> in der Mitte.
    </span>
</span>
```

An extra span tag is inserted to surround the whole translation so that it can mark the string with its unique id
using an `x-resource-id` attribute. The reason for this is to enable linguistic review of the translated product.
If a mistranslation is found during linguistic review, this unique id can be used to connect that particular string
back to the source code where the string came from and back to the translation in your translation set. Often-times
the right string to fix is difficult to identify because there are a number of strings in the product that may contain
similar or even the exact same text. You don't want to "fix" the translation of a similar string erroneously because
then you end up with two bugs instead of zero!

** With Replacement Parameters **

Use the Param component to indicate where in the string to substitute a value:

```jsx
// @NOTE: You can only use require instead of import in markdown.
const Param = require('./Param').default;

<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
>
    <span>
        English <b><Param value="text" description="item to describe"/></b> with <Link to="some://url">subcomponents</Link> in the middle of it.
    </span>
</FormattedCompMessage>
```

The Param must have both a value and a description prop. The description describes for the translators what is substituted into the string.

Various types of values are allowed in Param component values, including JSX and even functions! Example:

```jsx
// @NOTE: You can only use require instead of import in markdown.
const Param = require('./Param').default;

<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
>
    <span>
        The type is <b><Param value="text" description="a textual parameter"/></b> which contains <span class="pretty-numbers"><Param value="2.334" description="number of items"/></span> items.
        These items are <Param value={true} description="a boolean value"/>.
        They contain <Param value={<span class="kotter">Any arbitrary <Link to="x">jsx</Link> can go here!</span>} description="arbitrary jsx"/>.
        A function can return <Param description="the result of a call to a function" value={function() {
            return "a value";
        }}/>.
    </span>
</FormattedCompMessage>
```

Text is included as-is. Numbers are converted to strings using the regular javascript type coersion. It is highly recommended
to use a number formatter instead, so that numbers are presented in a localized fashion. Booleans are converted to the string "true" or
"false" in English. It is recommended to use the boolean value to choose between two localized strings instead of using these
values in English. Jsx expressions get substituted in as-is. They are not translated unless you explicitly translate the text
using intl.formatMessage(). If the value of a property is a function, that function will be called to retrieve
a value to substitute in for the parameter.

Parameters are represented in the string to translate as a self-closing tag of the form "p" + digits. This hides the contents
of the parameter and allows React to rerender only the parts of the string that have changed when the value of the parameter
component changes.

For example, the string to translate for the above example would be:

```json
"The type is <c0><p0/></c0> which contains <c1><p1/></c1> items. These items are <p2/>. They contain <p3/>. A function can return <p4/>."
```

Note that whitespace in the middle of the string is compressed because it doesn't matter to the translation or to the final
HTML output.

** Avoid This **

Do not put brace expressions in the text to translate! They will get replaced before the FormattedCompMessage component
is created, and therefore the source string will contain the value of the expression. When the component attempts to
load the translation, that source string will not be found, and therefore the translation will also not be found.
Strings with brace expressions in them will be rejected by the babel plugin when they are extracted.

Use replacement parameters instead (see the Param component in the section above), as they get replaced after
the string is translated instead of before.

Do not do this:

```jsx
const user = {name: "Fred"};

<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
>
    English text to translate here for user {user.name}
</FormattedCompMessage>
```

Do this instead:

```jsx
// @NOTE: You can only use require instead of import in markdown.
const Param = require('./Param').default;

const user = {name: "Fred"};

<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
>
    English text to translate here for user <Param value={user.name} description="The user's name"/>
</FormattedCompMessage>
```

** Locale-sensitive Plural Support **

To do locale-sensitive plurals, give a numeric count prop to your FormattedCompMessage instance and embed
some Plural components in the body of the component.

```jsx
// @NOTE: You can only use require instead of import in markdown.
const Plural = require('./Plural').default;
const Param = require('./Param').default;

const somenumber = 5;

<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
    count={somenumber}
>
    <Plural category="one">
        <span>
            User <Param value="user" description="Name of the user that shared the file"/> shared the file
            with <b><Param value={somenumber} description="Number of other users that the file was shared with"/></b> other user.
        </span>
    </Plural>
    <Plural category="other">
        <span>
            User <Param value="user" description="Name of the user that shared the file"/> shared the file
            with <b><Param value={somenumber} description="Number of other users that the file was shared with"/></b> other users.
        </span>
    </Plural>
</FormattedCompMessage>
```

The Plural subcomponents require a category prop, which must have a string with one of the following values:

* `zero`
* `one`
* `two`
* `few`
* `many`
* `other`

Plurals with other categories will be ignored.

FormattedCompMessage component instances that have a count prop must have a Plural component for each of
the `one` and the `other` categories embedded in its body. The `one` category is the singular string, and
the `other` is the plural string in English. Translators will add the right categories for their own language and
the react-intl code will automatically select the string for the category based on the value of
the `count` prop.

The FormattedCompMessage component will transform its children into a string that translators can easily
translate. In the case of Plural subcomponents, this component will create a plural string in the form
that react-intl is expecting, which is the syntax of the intl-messageformat package. The
intl-messageformat syntax for the above example is as follows:

```
"{count, plural, one {User <p0/> shared the file with <c0><p1/></c0> other user.} other {User <p0/> shared the file with <c0><p1/></c0> other users.}}"
```

Note that the Plural subcomponents all become one long string with parts for each plural category. The
subcomponents and parameters inside each part are numbered starting at zero, as each string is considered
a separate entity. Translators should already be familiar with the above syntax, as it is used in regular
react-intl text as well.
