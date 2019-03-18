### Examples

**Basic**

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

**With Subcomponents**

JSX components can be nested inside of the defaultMessage, which is something you cannot do
with FormattedHTMLMessage:

```jsx
<FormattedCompMessage
    id="unique.id"
    description="description for translators to explain the context of this string"
    defaultMessage={<span>English <b>text</b> with <Link href="some://url">subcomponents</Link> in the middle of it.</span>}
/>
```

Children components in the body of the FormattedCompMessage are treated the same as a defaultMessage prop. Exactly one of
children or the defaultMessage prop must be specified. The above is equivalent to this:

```jsx
<FormattedCompMessage id="unique.id" description="description for translators to explain the context of this string">
    <span>
        English <b>text</b> with <Link href="some://url">subcomponents</Link> in the middle of it.
    </span>
</FormattedCompMessage>
```

Components and HTML are hidden from the translator, so changing the contents of a tag does not cause a retranslation,
and the translator does not have the ability to change the tag or introduce an injection attack.

**With Replacement Parameters**

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

**Avoid This**

Do not put brace expressions in the text to translate. They will get replaced before the FormattedCompMessage component
is called, and therefore the source string will contain the value of the expression. When the component attempts to
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

**Locale-sensitive Plural Support**

To do locale-sensitive plurals, give a numeric count prop and embed some Plural components
in the body of the component.

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
the `other` is the plural string. Translators will add the right categories for their own language and
the react-intl code will automatically select the string for the category based on the value of 
the `count` prop.
