function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { expect, userEvent, waitFor, within, fn, screen } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import ContentSidebar from '../../ContentSidebar';
import { aiSuggestionForDateField, aiSuggestionsForMyAttribute, fileIdWithMetadata, fileIdWithoutMetadata, mockEmptyMetadataInstances, mockEnterpriseMetadataTemplates, mockErrorDeleteMyTemplateMetadataRequest, mockFileRequest, mockFileRequestWithoutMetadata, mockGlobalMetadataTemplates, mockMetadataInstances } from '../__mocks__/MetadataSidebarRedesignedMocks';
import { mockUserRequest } from '../../../common/__mocks__/mockRequests';
import { mockMetadataTemplatesWithMultilevelTaxonomy, mockMetadataTemplatesWithSinglelevelTaxonomy, taxonomyMockHandlers } from '../__mocks__/TaxonomyMocks';
const token = global.TOKEN;
const defaultMetadataArgs = {
  fileId: fileIdWithMetadata,
  isFeatureEnabled: true,
  onError: fn(),
  onSuccess: fn()
};
const defaultMetadataSidebarProps = {
  isFeatureEnabled: true,
  onError: fn(),
  onSuccess: fn()
};
const mockFeatures = {
  'metadata.redesign.enabled': true
};
const mockLogger = {
  onReadyMetric: ({
    endMarkName
  }) => {
    // eslint-disable-next-line no-console
    console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
  }
};
export const AddTemplateDropdownMenuOn = {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    }, {
      timeout: 2000
    });
    expect(addTemplateButton).toBeInTheDocument();
    await userEvent.click(addTemplateButton);
    const customMetadataOption = canvas.getByRole('option', {
      name: 'Custom Metadata'
    });
    expect(customMetadataOption).toBeInTheDocument();
    expect(customMetadataOption).toHaveAttribute('aria-disabled');
  }
};
export const AddTemplateDropdownMenuOnEmpty = {
  args: {
    fileId: fileIdWithoutMetadata,
    metadataSidebarProps: {
      isBoxAiSuggestionsEnabled: true,
      isBetaLanguageEnabled: false,
      isFeatureEnabled: true,
      onError: fn(),
      onSuccess: fn()
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    }, {
      timeout: 2000
    });
    expect(addTemplateButton).toBeInTheDocument();
    await userEvent.click(addTemplateButton);
    const options = canvas.getAllByRole('option');
    expect(options).toHaveLength(5);
    options.forEach(option => {
      expect(option).not.toHaveAttribute('disabled');
    });
  }
};
export const FilterInstancesDropdown = {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      const filterInstancesButton = await canvas.findByRole('combobox');
      expect(filterInstancesButton).toBeInTheDocument();
      await userEvent.click(filterInstancesButton);
      const firstOption = canvas.getByRole('option', {
        name: 'My Template'
      });
      expect(firstOption).toBeInTheDocument();
      const secondOption = canvas.getByRole('option', {
        name: 'Select Dropdowns'
      });
      expect(secondOption).toBeInTheDocument();
      const thirdOption = canvas.getByRole('option', {
        name: 'Custom Metadata'
      });
      expect(thirdOption).toBeInTheDocument();
      await userEvent.click(firstOption);
      const headlines = await canvas.findAllByRole('heading', {
        level: 4
      });
      expect(headlines).toHaveLength(1);
      expect(headlines[0].textContent).toEqual('My Template');
    }, {
      timeout: 2000
    });
  }
};
const defaultMockHandlers = [http.get(mockUserRequest.url, () => {
  return HttpResponse.json(mockUserRequest.response);
}), http.get(mockFileRequest.url, () => {
  return HttpResponse.json(mockFileRequest.response);
}), http.get(mockFileRequestWithoutMetadata.url, () => {
  return HttpResponse.json(mockFileRequestWithoutMetadata.response);
}), http.get(mockMetadataInstances.url, () => {
  return HttpResponse.json(mockMetadataInstances.response);
}), http.get(mockGlobalMetadataTemplates.url, () => {
  return HttpResponse.json(mockGlobalMetadataTemplates.response);
}), http.get(mockEmptyMetadataInstances.url, () => {
  return HttpResponse.json(mockEmptyMetadataInstances.response);
}), http.get(mockEnterpriseMetadataTemplates.url, () => {
  return HttpResponse.json(mockEnterpriseMetadataTemplates.response);
})];
export const AddingNewMetadataTemplate = {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    });
    expect(addTemplateButton).toBeInTheDocument();
    await userEvent.click(addTemplateButton);
    const customMetadataOption = canvas.getByRole('option', {
      name: 'Virus Scan'
    });
    expect(customMetadataOption).toBeInTheDocument();
    await userEvent.click(customMetadataOption);
    const templateHeader = await canvas.findByRole('heading', {
      name: 'Virus Scan'
    });
    expect(templateHeader).toBeInTheDocument();
  }
};
export const UnsavedChangesModalWhenChoosingDifferentTemplate = {
  args: {
    fileId: fileIdWithoutMetadata,
    metadataSidebarProps: defaultMetadataSidebarProps
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    });
    expect(addTemplateButton).toBeInTheDocument();
    await userEvent.click(addTemplateButton);
    const customMetadataOption = canvas.getByRole('option', {
      name: 'Virus Scan'
    });
    expect(customMetadataOption).toBeInTheDocument();
    await userEvent.click(customMetadataOption);
    await userEvent.click(addTemplateButton);
    const myTemplateOption = canvas.getByRole('option', {
      name: 'My Template'
    });
    expect(myTemplateOption).toBeInTheDocument();
    await userEvent.click(myTemplateOption);
    const unsavedChangesModal = await screen.findByRole('heading', {
      level: 2,
      name: 'Unsaved Changes'
    }, {
      timeout: 5000
    });
    expect(unsavedChangesModal).toBeInTheDocument();
  }
};
export const EmptyStateWithBoxAiEnabled = {
  args: {
    fileId: fileIdWithoutMetadata,
    metadataSidebarProps: _objectSpread({}, defaultMetadataSidebarProps),
    features: _objectSpread(_objectSpread({}, mockFeatures), {}, {
      'metadata.aiSuggestions.enabled': true,
      'metadata.betalanguage.enabled': false
    })
  }
};
export const EmptyStateWithBoxAiDisabled = {
  args: {
    fileId: fileIdWithoutMetadata,
    metadataSidebarProps: _objectSpread(_objectSpread({}, defaultMetadataSidebarProps), {}, {
      isBoxAiSuggestionsEnabled: false,
      isBetaLanguageEnabled: false
    })
  }
};
export const MetadataInstanceEditorWithDefinedTemplate = {
  args: {
    fileId: fileIdWithoutMetadata,
    metadataSidebarProps: defaultMetadataSidebarProps
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    });
    await userEvent.click(addTemplateButton);
    const customMetadataOption = canvas.getByRole('option', {
      name: 'My Template'
    });
    await userEvent.click(customMetadataOption);
  }
};
export const MetadataInstanceEditorWithCustomTemplate = {
  args: {
    fileId: fileIdWithoutMetadata,
    metadataSidebarProps: defaultMetadataSidebarProps
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    }, {
      timeout: 2000
    });
    await userEvent.click(addTemplateButton);
    const customMetadataOption = canvas.getByRole('option', {
      name: 'Custom Metadata'
    });
    await userEvent.click(customMetadataOption);
  }
};
export const MetadataInstanceEditorCancelChanges = {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Edit buttons contains also template name
    const editButton = await canvas.findByRole('button', {
      name: 'Edit My Template'
    });
    expect(editButton).toBeInTheDocument();
    let headlines = await canvas.findAllByRole('heading', {
      level: 4
    });
    expect(headlines).toHaveLength(3);
    expect(headlines.map(heading => heading.textContent)).toEqual(expect.arrayContaining(['My Template', 'Select Dropdowns', 'Custom Metadata']));

    // go to edit mode - only edited template is visible
    await userEvent.click(editButton);
    headlines = await canvas.findAllByRole('heading', {
      level: 4
    });
    expect(headlines).toHaveLength(1);
    expect(headlines.map(heading => heading.textContent)).toEqual(expect.arrayContaining(['My Template']));

    // cancel editing - back to list view
    const cancelButton = await canvas.findByRole('button', {
      name: 'Cancel'
    });
    await userEvent.click(cancelButton);
    headlines = await canvas.findAllByRole('heading', {
      level: 4
    });
    expect(headlines).toHaveLength(3);
    expect(headlines.map(heading => heading.textContent)).toEqual(expect.arrayContaining(['My Template', 'Select Dropdowns', 'Custom Metadata']));
  }
};
export const DeleteButtonIsDisabledWhenAddingNewMetadataTemplate = {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    });
    expect(addTemplateButton).toBeInTheDocument();
    await userEvent.click(addTemplateButton);
    const customMetadataOption = canvas.getByRole('option', {
      name: 'Virus Scan'
    });
    expect(customMetadataOption).toBeInTheDocument();
    await userEvent.click(customMetadataOption);
    const deleteButton = await canvas.findByRole('button', {
      name: 'Delete'
    });
    expect(deleteButton).toBeDisabled();
  }
};
export const DeleteButtonIsEnabledWhenEditingMetadataTemplateInstance = {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const editMetadataInstanceButton = await canvas.findByRole('button', {
      name: 'Edit My Template'
    });
    expect(editMetadataInstanceButton).toBeInTheDocument();
    await userEvent.click(editMetadataInstanceButton);
    const deleteButton = await canvas.findByRole('button', {
      name: 'Delete'
    });
    expect(deleteButton).toBeEnabled();
  }
};
export const MetadataInstanceEditorAddTemplateAgainAfterCancel = {
  args: {
    fileId: fileIdWithoutMetadata,
    metadataSidebarProps: defaultMetadataSidebarProps
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    });
    await userEvent.click(addTemplateButton);
    const templateMetadataOption = canvas.getByRole('option', {
      name: 'My Template'
    });
    expect(templateMetadataOption).not.toHaveAttribute('aria-disabled');
    await userEvent.click(templateMetadataOption);

    // Check if currently open template is disabled in dropdown
    await userEvent.click(addTemplateButton);
    const templateMetadataOptionDisabled = canvas.getByRole('option', {
      name: 'My Template'
    });
    expect(templateMetadataOptionDisabled).toHaveAttribute('aria-disabled');

    // Check if template available again after cancelling
    const cancelButton = await canvas.findByRole('button', {
      name: 'Cancel'
    });
    await userEvent.click(cancelButton);
    await userEvent.click(addTemplateButton);
    const templateMetadataOptionEnabled = canvas.getByRole('option', {
      name: 'My Template'
    });
    expect(templateMetadataOptionEnabled).not.toHaveAttribute('aria-disabled');
  }
};
export const SwitchEditingTemplateInstances = {
  args: {
    fileId: '416047501580',
    metadataSidebarProps: defaultMetadataSidebarProps
  },
  parameters: {
    msw: {
      handlers: [...defaultMockHandlers, http.get(`/2.0/files/416047501580`, () => {
        return HttpResponse.json(mockFileRequest.response);
      }), http.get(`/2.0/files/416047501580/metadata`, () => {
        return HttpResponse.json(mockMetadataInstances.response);
      })]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // open and edit a new template
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    });
    await userEvent.click(addTemplateButton);
    const templateMetadataOption = canvas.getByRole('option', {
      name: 'My Template'
    });
    await userEvent.click(templateMetadataOption);
    const input = await canvas.findByRole('textbox');
    await userEvent.type(input, 'Lorem ipsum dolor.');

    // open another template while editing the first one (with discarding changes)
    await userEvent.click(addTemplateButton);
    const templateMetadataOptionA = canvas.getByRole('option', {
      name: 'My Template'
    });
    const templateMetadataOptionB = canvas.getByRole('option', {
      name: 'Virus Scan'
    });
    expect(templateMetadataOptionA).toHaveAttribute('aria-disabled');
    expect(templateMetadataOptionB).not.toHaveAttribute('aria-disabled');
    await userEvent.click(templateMetadataOptionB);
    const unsavedChangesModal = await screen.findByRole('heading', {
      level: 2,
      name: 'Unsaved Changes'
    }, {
      timeout: 5000
    });
    expect(unsavedChangesModal).toBeInTheDocument();
    const unsavedChangesModalDiscardButton = await screen.findByRole('button', {
      name: 'Discard Changes'
    });
    await userEvent.click(unsavedChangesModalDiscardButton);
    const newTemplateHeader = await canvas.findByRole('heading', {
      name: 'Virus Scan'
    });
    expect(newTemplateHeader).toBeInTheDocument();

    // check if template buttons disabled correctly after switching editors
    await userEvent.click(addTemplateButton);
    const templateMetadataOptionAAfterSwitch = canvas.getByRole('option', {
      name: 'My Template'
    });
    const templateMetadataOptionBAfterSwitch = canvas.getByRole('option', {
      name: 'Virus Scan'
    });
    expect(templateMetadataOptionAAfterSwitch).not.toHaveAttribute('aria-disabled');
    expect(templateMetadataOptionBAfterSwitch).toHaveAttribute('aria-disabled');
  }
};
export const MetadataInstanceEditorAIEnabled = {
  args: {
    features: _objectSpread(_objectSpread({}, mockFeatures), {}, {
      'metadata.aiSuggestions.enabled': true,
      'metadata.betalanguage.enabled': false
    })
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const autofillWithBoxAI = await canvas.findAllByRole('button', {
      name: /Autofill .+ with Box AI/
    });
    expect(autofillWithBoxAI).toHaveLength(2);
    const editButton = await canvas.findByRole('button', {
      name: 'Edit My Template'
    });
    await userEvent.click(editButton);
    const autofillButton = await canvas.findByRole('button', {
      name: 'Autofill'
    });
    expect(autofillButton).toBeInTheDocument();
  }
};
export const MetadataInstanceEditorAIEnabledAdvancedExtractAgent = {
  args: {
    features: _objectSpread(_objectSpread({}, mockFeatures), {}, {
      'metadata.aiSuggestions.enabled': true,
      'metadata.extractAdvancedAgents.enabled': true
    })
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Edit one instance
    const editButton = await canvas.findByRole('button', {
      name: 'Edit My Template'
    });
    await userEvent.click(editButton);

    // Find the SplitButton
    const splitButton = await canvas.findByRole('button', {
      name: /Autofill/
    });
    expect(splitButton).toBeVisible();
    await userEvent.hover(splitButton);
    const dropdownButton = await canvas.findByRole('button', {
      name: 'See agent options.'
    });
    expect(dropdownButton).toBeVisible();
  }
};
export const ShowErrorWhenAIAPIIsUnavailable = {
  args: {
    features: _objectSpread(_objectSpread({}, mockFeatures), {}, {
      'metadata.aiSuggestions.enabled': true,
      'metadata.betalanguage.enabled': false
    })
  },
  parameters: {
    msw: {
      handlers: [...defaultMockHandlers, http.post(aiSuggestionsForMyAttribute.url, () => {
        return new HttpResponse('Not Found', {
          status: 404
        });
      })]
    },
    test: {
      dangerouslyIgnoreUnhandledErrors: true
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const autofillButton = await canvas.findByRole('button', {
      name: 'Autofill My Template with Box AI'
    });
    await userEvent.click(autofillButton);
    const errorAlert = await canvas.findByText('We’re sorry, something went wrong.');
    expect(errorAlert).toBeInTheDocument();
  }
};
export const SuggestionsWhenAIAPIResponses = {
  args: {
    features: _objectSpread(_objectSpread({}, mockFeatures), {}, {
      'metadata.aiSuggestions.enabled': true,
      'metadata.betalanguage.enabled': false
    })
  },
  parameters: {
    msw: {
      handlers: [...defaultMockHandlers, http.post(aiSuggestionsForMyAttribute.url, () => HttpResponse.json(aiSuggestionsForMyAttribute.response))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const autofillButton = await canvas.findByRole('button', {
      name: 'Autofill My Template with Box AI'
    });
    userEvent.click(autofillButton);
    const suggestion = await canvas.findByText('it works fine');
    expect(suggestion).toBeInTheDocument();
    const replaceButton = await canvas.findByRole('button', {
      name: 'Clear and Replace'
    });
    expect(replaceButton).toBeInTheDocument();
    await userEvent.click(replaceButton);
    const input = canvas.getByLabelText('My Attribute');
    expect(input).toHaveValue('it works fine');
  }
};
export const SuggestionForNewlyCreatedTemplateInstance = {
  args: {
    features: _objectSpread(_objectSpread({}, mockFeatures), {}, {
      'metadata.aiSuggestions.enabled': true,
      'metadata.betalanguage.enabled': false
    })
  },
  parameters: {
    msw: {
      handlers: [...defaultMockHandlers, http.post(aiSuggestionsForMyAttribute.url, () => HttpResponse.json(aiSuggestionForDateField.response))]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addTemplateButton = await canvas.findByRole('button', {
      name: 'Add template'
    });
    expect(addTemplateButton).toBeInTheDocument();
    await userEvent.click(addTemplateButton);
    const customMetadataOption = canvas.getByRole('option', {
      name: 'Date Template'
    });
    expect(customMetadataOption).toBeInTheDocument();
    await userEvent.click(customMetadataOption);
    const templateHeader = await canvas.findByRole('heading', {
      name: 'Date Template'
    });
    expect(templateHeader).toBeInTheDocument();
    const autofillButton = await canvas.findByRole('button', {
      name: 'Autofill'
    });
    userEvent.click(autofillButton);
    const suggestion = await canvas.findByText('4/1/2024', {}, {
      timeout: 5000
    });
    expect(suggestion).toBeInTheDocument();
  }
};
export const ShowErrorOnDelete = {
  parameters: {
    msw: {
      handlers: [...defaultMockHandlers, http.delete(mockErrorDeleteMyTemplateMetadataRequest.url, () => {
        return HttpResponse.json(mockErrorDeleteMyTemplateMetadataRequest.response, {
          status: 404
        });
      })]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const editButton = await canvas.findByRole('button', {
      name: 'Edit My Template'
    }, {
      timeout: 2000
    });
    await userEvent.click(editButton);
    const deleteButton = await canvas.findByRole('button', {
      name: 'Delete'
    });
    await userEvent.click(deleteButton);
    const confirmModal = await screen.findByRole('dialog', {
      name: /delete.+/i
    }, {
      timeout: 2000
    });
    const confirmInput = within(confirmModal).getByRole('textbox');
    await userEvent.type(confirmInput, 'My Template');
    const confirmButton = within(confirmModal).getByRole('button', {
      name: 'Confirm'
    });
    await userEvent.click(confirmButton);
    const errorAlert = await canvas.findByText('An error has occurred while updating metadata. Please refresh the page and try again.');
    expect(errorAlert).toBeInTheDocument();
  }
};
export const ViewMultilevelTaxonomy = {
  args: {
    features: _objectSpread(_objectSpread({}, mockFeatures), {}, {
      'metadata.multilevelTaxonomy.enabled': true
    })
  },
  parameters: {
    msw: {
      handlers: [...taxonomyMockHandlers, http.get(mockMetadataTemplatesWithMultilevelTaxonomy.url, () => {
        return HttpResponse.json(mockMetadataTemplatesWithMultilevelTaxonomy.response);
      })]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      const multilevelOptionButton = canvas.getByRole('button', {
        name: 'London'
      });
      expect(multilevelOptionButton).toBeInTheDocument();
      await userEvent.click(multilevelOptionButton);
      const multilevelDialog = screen.getByRole('dialog');
      expect(multilevelDialog).toBeInTheDocument();
    });
  }
};
export const ViewSinglelevelTaxonomy = {
  parameters: {
    msw: {
      handlers: [...taxonomyMockHandlers, http.get(mockMetadataTemplatesWithSinglelevelTaxonomy.url, () => {
        return HttpResponse.json(mockMetadataTemplatesWithSinglelevelTaxonomy.response);
      })]
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      const singlelevelOptionButton = canvas.getByRole('button', {
        name: 'Blue'
      });
      expect(singlelevelOptionButton).toBeInTheDocument();
      await userEvent.click(singlelevelOptionButton);
      const singlelevelDialog = screen.getByRole('dialog');
      expect(singlelevelDialog).toBeInTheDocument();
    });
  }
};
export const EditMultilevelTaxonomy = _objectSpread(_objectSpread({}, ViewMultilevelTaxonomy), {}, {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const editButton = await waitFor(() => canvas.getByRole('button', {
      name: 'Edit My Taxonomy'
    }));
    await userEvent.click(editButton);
    const multilevelInput = canvas.getByRole('combobox');
    const optionChip = canvas.getByRole('button', {
      name: 'London'
    });
    expect(multilevelInput).toBeInTheDocument();
    expect(optionChip).toBeInTheDocument();
    await userEvent.click(multilevelInput);
    const listbox = await waitFor(() => canvas.getByRole('listbox'));
    expect(listbox).toBeInTheDocument();
    let expandButtons = await waitFor(() => canvas.getAllByRole('button', {
      name: 'Expand branch'
    }));
    await userEvent.click(expandButtons[1]);
    const hokkaidoOption = await waitFor(() => canvas.getByText('Hokkaido'));
    expect(hokkaidoOption).toBeInTheDocument();
    expandButtons = await waitFor(() => screen.getAllByRole('button', {
      name: 'Expand branch'
    }));
    await userEvent.click(expandButtons[2]);
    const sapporoOption = await waitFor(() => canvas.getByRole('treeitem', {
      name: 'Sapporo'
    }));
    expect(sapporoOption).toBeInTheDocument();
    expect(sapporoOption).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(sapporoOption);
    const sapporoSelection = await waitFor(() => canvas.getByRole('gridcell', {
      name: 'Sapporo'
    }));
    expect(sapporoOption).toBeInTheDocument();
    expect(sapporoOption).toHaveAttribute('aria-selected', 'true');
    expect(sapporoSelection).toBeInTheDocument();
  }
});
export const EditSinglelevelTaxonomy = _objectSpread(_objectSpread({}, ViewSinglelevelTaxonomy), {}, {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const editButton = await waitFor(() => canvas.getByRole('button', {
      name: 'Edit My Taxonomy'
    }));
    await userEvent.click(editButton);
    const singlelevelInput = canvas.getByRole('combobox');
    const blueSelection = canvas.getByRole('gridcell', {
      name: 'Blue'
    });
    expect(singlelevelInput).toBeInTheDocument();
    expect(blueSelection).toBeInTheDocument();
    await userEvent.click(singlelevelInput);
    const listbox = await waitFor(() => canvas.getByRole('listbox'));
    expect(listbox).toBeInTheDocument();
    const blueOption = await waitFor(() => canvas.getByRole('option', {
      name: 'Blue'
    }));
    const redOption = await waitFor(() => canvas.getByRole('option', {
      name: 'Red'
    }));
    const greenOption = await waitFor(() => canvas.getByRole('option', {
      name: 'Green'
    }));
    expect(blueOption).toBeInTheDocument();
    expect(redOption).toBeInTheDocument();
    expect(greenOption).toBeInTheDocument();
    expect(blueOption).toHaveAttribute('aria-selected', 'true');
    expect(redOption).toHaveAttribute('aria-selected', 'false');
    expect(greenOption).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(redOption);
    const redSelection = await waitFor(() => canvas.getByRole('gridcell', {
      name: 'Red'
    }));
    expect(redSelection).toBeInTheDocument();
    expect(blueSelection).toBeInTheDocument();
    expect(blueOption).toBeInTheDocument();
    expect(redOption).toBeInTheDocument();
    expect(greenOption).toBeInTheDocument();
    expect(blueOption).toHaveAttribute('aria-selected', 'true');
    expect(redOption).toHaveAttribute('aria-selected', 'true');
    expect(greenOption).toHaveAttribute('aria-selected', 'false');
  }
});
const meta = {
  title: 'Elements/ContentSidebar/MetadataSidebarRedesign/tests/visual-regression-tests',
  component: ContentSidebar,
  args: {
    token,
    metadataSidebarProps: _objectSpread({}, defaultMetadataArgs),
    hasMetadata: true,
    features: mockFeatures,
    fileId: fileIdWithMetadata,
    logger: mockLogger
  },
  parameters: {
    msw: {
      handlers: defaultMockHandlers
    }
  }
};
export default meta;
//# sourceMappingURL=MetadataSidebarRedesign-visual.stories.js.map