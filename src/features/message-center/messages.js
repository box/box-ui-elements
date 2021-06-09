// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    title: {
        defaultMessage: "What's New",
        description: 'Title for the message center modal',
        id: 'be.messageCenter.title',
    },
    all: {
        defaultMessage: 'All',
        description: 'Title for all categories',
        id: 'be.messageCenter.all',
    },
    product: {
        defaultMessage: 'Product',
        description: 'Title for product category',
        id: 'be.messageCenter.product',
    },
    events: {
        defaultMessage: 'Events',
        description: 'Title for product category',
        id: 'be.messageCenter.events',
    },
    boxEducation: {
        defaultMessage: 'Box Education',
        description: 'Title for Box education category',
        id: 'be.messageCenter.boxEducation',
    },
    noPosts: {
        defaultMessage: 'There are no posts for this category at the moment.',
        description: 'Displayed when there are no posts to display',
        id: 'be.messageCenter.noPosts',
    },
    errorFetchingPosts: {
        defaultMessage: 'Sorry, we are having trouble showing posts at the moment. It may help to refresh the page.',
        description: 'Displayed when there was an error fetching posts',
        id: 'be.messageCenter.errorFetchingPosts',
    },
});

export default messages;
