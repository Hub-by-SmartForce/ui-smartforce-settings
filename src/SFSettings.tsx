import React, { Fragment, useEffect } from 'react';
import styles from './SFSettings.module.scss';
import { SFPaper, SFScrollable } from 'sfui';
import SectionCard from './Components/SectionCard/SectionCard';
import SectionItem from './Components/SectionItem/SectionItem';
import SettingsPanel from './Components/SettingsPanel/SettingsPanel';
import Themes from './Views/Appearance/Themes/Themes';
import SectionMenu from './Components/SectionMenu/SectionMenu';
import InnerViews from './Components/InnerViews/InnerViews';
import { ChangePassword } from './Views/ChangePassword/ChangePassword';
import { MyProfile } from './Views/MyProfile/MyProfile';
import { AgencyInformation } from './Views/AgencyInformation/AgencyInformation';
import { AgencyMembers } from './Views/AgencyMembers/AgencyMembers';
import { AgencyMessaging } from './Views/AgencyMessaging/AgencyMessaging';
import { AgencyAreas } from './Views/AgencyAreas/AgencyAreas';
import { AgencyGroups } from './Views/AgencyGroups/AgencyGroups';
import { ManageBusinessCard } from './Views/ManageBusinessCard/ManageBusinessCard';
import {
  MediaContext,
  CustomerContext,
  UserContext,
  SubscriptionContext
} from './Context';
import { SettingsError } from './Models/Error';
import { checkPermissions, getAppSubscription, isRoleOfficer } from './Helpers';
import {
  AGENCY_AREAS_CREATE,
  AGENCY_GROUPS_CREATE,
  AGENCY_INFORMATION_UPDATE,
  AGENCY_INVITATIONS_READ,
  AGENCY_MEMBERS_READ,
  AGENCY_PREFERENCES_READ,
  AGENCY_SUBSCRIPTION_UPDATE,
  AGENCY_TITLES_READ,
  USER_PROFILE_READ
} from './Constants';
import { AppEnv, ApplicationProduct } from './Models/Apps';
import { getApiBaseUrl, getAppBaseUrl } from './Helpers/application';
import { AgencyShifts } from './Views/AgencyShifts/AgencyShifts';
import { AgencyEvents } from './Views/AgencyEvents/AgencyEvents';
import { ApiContext } from './Context/Api';
import { InnerView } from './Components/InnerViews/InnerView/InnerView';
import { AgencyBillingRender } from './Views/AgencyBilling/AgencyBillingRender';

const onGetStarted = (env: AppEnv, product: ApplicationProduct) => {
  window.open(getAppBaseUrl(env, product), '_blank');
};

const disabledViews: string[] = ['tasks', 'inventory'];

const isViewDisabled = (section: string): boolean => {
  return disabledViews.includes(section);
};

export interface SFSettingsProps {
  className?: string;
  stripeApiKey: string;
  selectedSectionName?: string;
  enviroment: AppEnv;
  product: ApplicationProduct;
  onError: (e: SettingsError) => void;
  onHome: () => void;
  onActivate: (product: string) => void;
  onUpgrade: (product: string) => void;
  onSectionChange: (name: string) => void;
  onGenerateDebitUrl: (url: string) => void;
}

export interface SectionItemValue {
  name: string;
  cardTitle: string;
  viewTitle: string;
  description: string;
  component: JSX.Element;
  image?: string;
}

export interface SectionCardValue {
  name: string;
  title: string;
  items: SectionItemValue[];
}

export const SFSettings = ({
  className,
  stripeApiKey,
  selectedSectionName,
  enviroment,
  product,
  onError,
  onActivate,
  onUpgrade,
  onHome,
  onSectionChange,
  onGenerateDebitUrl
}: SFSettingsProps): React.ReactElement<SFSettingsProps> => {
  const { isPhone } = React.useContext(MediaContext);
  const { user } = React.useContext(UserContext);
  const { customer } = React.useContext(CustomerContext);
  const { subscriptions } = React.useContext(SubscriptionContext);
  const [isPanelOpen, setIsPanelOpen] = React.useState<boolean>(false);
  const [isPanelLoading, setIsPanelLoading] = React.useState<boolean>(false);
  const hasShiftSubscription: boolean = !!getAppSubscription(
    subscriptions,
    'shift'
  );

  const onPanelLoading = () => setIsPanelLoading(true);

  const onPanelDone = () => {
    setIsPanelLoading(false);
    setIsPanelOpen(false);
  };

  let sectionCards: SectionCardValue[] = [];

  let userItems: SectionItemValue[] = [];
  if (user && checkPermissions(USER_PROFILE_READ, user.role?.permissions)) {
    userItems = [
      {
        cardTitle: user?.name || '',
        viewTitle: 'My Profile',
        name: 'profile',
        description: 'Edit your account information.',
        image: user?.avatar_url || '',
        component: (
          <MyProfile
            onError={onError}
            onLoading={onPanelLoading}
            onDone={onPanelDone}
          />
        )
      }
    ];
  }

  userItems = [
    ...userItems,
    {
      cardTitle: 'Password',
      viewTitle: 'Password',
      name: 'password',
      description: 'Change your Password.',
      component: (
        <ChangePassword
          onError={onError}
          onLoading={onPanelLoading}
          onDone={onPanelDone}
        />
      )
    }
  ];

  sectionCards = [
    ...sectionCards,
    {
      title: 'My Profile',
      name: 'profile',
      items: userItems
    }
  ];

  let businessItems: SectionItemValue[] = [
    {
      name: 'manage_business_card',
      cardTitle: 'Manage Business Card',
      viewTitle: 'My Business Card',
      description: 'Manage your business card information.',
      component: <ManageBusinessCard onError={onError} onClose={onPanelDone} />
    }
  ];

  sectionCards = [
    ...sectionCards,
    {
      title: 'My Business Card',
      name: 'business_card',
      items: businessItems
    }
  ];

  let agencyItems: SectionItemValue[] = [];

  if (
    user &&
    checkPermissions(AGENCY_INFORMATION_UPDATE, user.role?.permissions)
  ) {
    agencyItems = [
      {
        cardTitle: customer?.full_name || '',
        viewTitle: 'Agency Information',
        name: 'agency',
        description: 'Edit Agency’s information.',
        image: customer?.badge || '',
        component: (
          <AgencyInformation
            onLoading={onPanelLoading}
            onDone={onPanelDone}
            onError={onError}
          />
        )
      }
    ];
  }

  if (
    user &&
    checkPermissions(AGENCY_SUBSCRIPTION_UPDATE, user.role.permissions)
  ) {
    agencyItems = [
      ...agencyItems,
      {
        cardTitle: 'Plan and Billing',
        viewTitle: 'Plan and Billing',
        name: 'billing',
        description: 'Only the agency owner can manage the billing plan.',
        component: (
          <AgencyBillingRender
            product={product}
            canUpdate={checkPermissions(
              AGENCY_SUBSCRIPTION_UPDATE,
              user.role.permissions
            )}
            onError={onError}
            stripeApiKey={stripeApiKey}
            onClose={onPanelDone}
            onGetStarted={(product: ApplicationProduct) =>
              onGetStarted(enviroment, product)
            }
            onUpgrade={onUpgrade}
            onActivate={onActivate}
            onGenerateDebitUrl={onGenerateDebitUrl}
          />
        )
      }
    ];
  }

  if (
    user &&
    checkPermissions(AGENCY_INFORMATION_UPDATE, user.role?.permissions)
  ) {
    sectionCards = [
      ...sectionCards,
      {
        title: 'Agency Information',
        name: 'agency',
        items: agencyItems
      }
    ];
  }

  if (
    user &&
    checkPermissions(AGENCY_MEMBERS_READ, user.role?.permissions) &&
    checkPermissions(AGENCY_INVITATIONS_READ, user.role?.permissions)
  ) {
    sectionCards = [
      ...sectionCards,
      {
        title: 'Members',
        name: 'members',
        items: [
          {
            cardTitle: 'Members',
            viewTitle: 'Members',
            name: 'members',
            description: "Add and manage your agency's members.",
            component: (
              <AgencyMembers
                onHome={onHome}
                onError={onError}
                onClose={onPanelDone}
              />
            )
          }
        ]
      }
    ];
  }

  if (user && checkPermissions(AGENCY_TITLES_READ, user.role?.permissions)) {
    sectionCards = [
      ...sectionCards,
      {
        title: 'Titles',
        name: 'titles',
        items: [
          {
            cardTitle: 'Titles',
            viewTitle: 'Titles',
            name: 'titles',
            description: "Add and manage your agency's titles.",
            component: <div></div>
          }
        ]
      }
    ];
  }

  if (user && checkPermissions(AGENCY_AREAS_CREATE, user.role.permissions)) {
    sectionCards = [
      ...sectionCards,
      {
        title: 'Areas',
        name: 'areas',
        items: [
          {
            cardTitle: 'Manage Areas',
            viewTitle: 'Manage Areas',
            name: 'areas',
            description: `Add and manage your agency's areas.`,
            component: <AgencyAreas onError={onError} onClose={onPanelDone} />
          }
        ]
      }
    ];
  }

  if (user && checkPermissions(AGENCY_GROUPS_CREATE, user.role.permissions)) {
    sectionCards = [
      ...sectionCards,
      {
        title: 'Groups',
        name: 'groups',
        items: [
          {
            cardTitle: 'Manage Groups',
            name: 'groups',
            viewTitle: 'Manage Groups',
            description:
              'Create, invite active members, and manage the groups.',
            component: <AgencyGroups onError={onError} onClose={onPanelDone} />
          }
        ]
      }
    ];
  }

  if (!isRoleOfficer(user?.role.id) && hasShiftSubscription) {
    sectionCards = [
      ...sectionCards,
      {
        title: 'Shifts',
        name: 'shifts',
        items: [
          {
            cardTitle: 'Manage Shifts',
            name: 'shifts',
            viewTitle: 'Manage Shifts',
            description: "Add and manage your agency's shifts.",
            component: <AgencyShifts onError={onError} onClose={onPanelDone} />
          }
        ]
      },
      {
        title: 'Tasks',
        name: 'tasks',
        items: [
          {
            cardTitle: '',
            name: 'tasks',
            viewTitle: '',
            description: '',
            component: <></>
          }
        ]
      },
      {
        title: 'Events',
        name: 'events',
        items: [
          {
            cardTitle: 'Manage Event Types',
            name: 'types',
            viewTitle: 'Manage Event Types',
            description: 'Add and manage event types for your agency.',
            component: <AgencyEvents onError={onError} onClose={onPanelDone} />
          }
        ]
      },
      {
        title: 'Inventory',
        name: 'inventory',
        items: [
          {
            cardTitle: '',
            name: 'inventory',
            viewTitle: '',
            description: '',
            component: <></>
          }
        ]
      }
    ];
  }

  if (
    user &&
    checkPermissions(AGENCY_PREFERENCES_READ, user.role.permissions)
  ) {
    sectionCards = [
      ...sectionCards,
      {
        title: 'Preferences',
        name: 'preferences',
        items: [
          {
            cardTitle: 'Messaging',
            name: 'messaging',
            viewTitle: 'Messaging',
            description:
              'In addition to the agency owner, choose who can receive the official communication addressed to the agency.',
            component: <AgencyMessaging onError={onError} />
          }
        ]
      }
    ];
  }

  sectionCards = [
    ...sectionCards,
    {
      title: 'Appearance',
      name: 'appearance',
      items: [
        {
          cardTitle: 'Themes',
          viewTitle: 'Themes',
          name: 'themes',
          description:
            'Change the appearance of your system across all of your workspaces.',
          component: <Themes />
        }
      ]
    }
  ];

  // Added constant to identify route selected
  const routeSectionSelected: number | undefined = sectionCards.findIndex(
    (section: SectionCardValue) => section.name === selectedSectionName
  );

  // If route section is set, change default view and section selected
  const [selectedSection, setSelectedSection] =
    React.useState<SectionCardValue>(
      sectionCards[routeSectionSelected !== -1 ? routeSectionSelected : 0]
    );

  const [selectedSubSection, setSelectedSubSection] = React.useState<number>(0);

  const selectCurrentSection = (
    selectedSection: SectionCardValue,
    subsectionIndex?: number
  ) => {
    onSectionChange(selectedSection.name);

    if (subsectionIndex !== undefined) {
      setSelectedSubSection(subsectionIndex);
      setIsPanelOpen(true);
    }
  };

  useEffect(() => {
    setSelectedSection(
      sectionCards[routeSectionSelected !== -1 ? routeSectionSelected : 0]
    );
  }, [routeSectionSelected]);

  useEffect(() => {
    // Opens the panel with the selected section if routeSection is selected
    if (routeSectionSelected !== -1 && isPhone) {
      setIsPanelOpen(true);
    }
  }, [routeSectionSelected, isPhone]);

  const isBusinessCardSelected: boolean =
    selectedSection.name === 'business_card';

  return (
    <ApiContext.Provider
      value={{
        product,
        settings: getApiBaseUrl(enviroment),
        shifts: `${getAppBaseUrl(enviroment, 'shift')}api`
      }}
    >
      <div className={`${styles.settings} ${className || ''}`}>
        {isPhone && (
          <Fragment>
            <SFScrollable containerClassName={styles.settingsCards}>
              {sectionCards.map((section: SectionCardValue) => (
                <SectionCard
                  key={`sectionCard-${section.name}`}
                  title={section.title}
                  disabled={isViewDisabled(section.name)}
                >
                  {section.items.map(
                    (item: SectionItemValue, subsectionIndex: number) => {
                      return (
                        <SectionItem
                          key={`sectionItem-${item.name}`}
                          title={item.cardTitle}
                          description={item.description}
                          image={item.image}
                          onClick={() =>
                            selectCurrentSection(section, subsectionIndex)
                          }
                        />
                      );
                    }
                  )}
                </SectionCard>
              ))}
            </SFScrollable>
            <SettingsPanel
              isOpen={isPanelOpen}
              isLoading={isPanelLoading}
              onClose={() => setIsPanelOpen(false)}
            >
              <InnerView
                view={selectedSection.items[selectedSubSection]}
                hideHeader={isBusinessCardSelected}
                isPhone
              />
            </SettingsPanel>
          </Fragment>
        )}

        {!isPhone && (
          <SFPaper elevation={2} className={styles.container}>
            <div className={styles.sectionMenu}>
              {sectionCards.map((section: SectionCardValue) => (
                <SectionMenu
                  key={`sectionMenu-${section.name}`}
                  title={section.title}
                  selected={section.name === selectedSection.name}
                  disabled={isViewDisabled(section.name)}
                  onClick={() => selectCurrentSection(section)}
                />
              ))}
            </div>

            <SFScrollable
              className={styles.scrollable}
              containerClassName={`${
                isBusinessCardSelected ? styles.isBusinessCard : ''
              }`}
            >
              <InnerViews
                views={selectedSection.items}
                isBusinessCard={isBusinessCardSelected}
              />
            </SFScrollable>
          </SFPaper>
        )}
      </div>
    </ApiContext.Provider>
  );
};
