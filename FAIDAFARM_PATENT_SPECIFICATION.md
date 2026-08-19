# SYSTEM AND METHOD FOR A ROLE-ADAPTIVE AGRICULTURAL MANAGEMENT PLATFORM

*Working technical specification prepared to support patent drafting for FaidaFarm. Not legal advice; for review by patent counsel. Excludes the Research Collection Workspace (household/child-nutrition/FMNR field-data-collection tooling), which is treated as an independent product. Reference numerals below correspond to Figures 1 and 2, described schematically in the "Brief Description of the Drawings" section — formal patent drawings should be produced by a patent draftsperson before filing.*

---

## FIELD OF THE INVENTION

The present invention relates to a computer-implemented system and method for digital agricultural management, and more particularly, but not exclusively, to a platform that unifies farm-level operational data with the data, analysis and advisory functions required by agricultural experts, extension officers, project managers and organizational leadership, within a single deployed application and a shared data model.

## BACKGROUND OF THE INVENTION

Two main types of digital agricultural software have been previously proposed.

A first type consists of single-purpose, farmer-facing consumer applications — for example weather-display tools, market-price lookup tools, or single-crop advisory tools. These serve one user directly but hold no organizational visibility: the data a farmer generates within such an application is not accessible to any agricultural expert, extension officer, project manager, or organizational leadership function responsible for supporting that farmer.

A second type consists of enterprise or organizational agricultural-management systems, built for use by cooperatives, agribusinesses, or development organizations. These serve the organizational side of agricultural operations but are not used directly by the farmer as an operational tool; the data they hold typically originates from an intermediary — a field officer or enumerator — entering information on the farmer's behalf, rather than from the farmer's own real-time activity.

*[Note to patent counsel: specific prior-art citations to be inserted following a formal novelty and freedom-to-operate search.]*

Both known types of system have disadvantages. Where only a farmer-facing application of the first type is deployed, the farmer's recorded activity has no path to the roles responsible for supervising or advising on it, so agronomic advice, supervision, and portfolio-level organizational decisions are made without visibility of the farmer's actual recorded data, or depend on the farmer separately reporting the same information by phone or in person. Where only an organizational system of the second type is deployed, the farmer receives no direct advisory return from the system, and the data held originates from an intermediary rather than from the farmer, introducing delay, transcription error, and cost. Where an organization operates both a farmer-facing application and a back-office system side by side, they are typically built as separate applications with separate data models, and reconciling a farmer's record between them requires a manual export/import step, which is slow, error-prone, and breaks down under the intermittent network connectivity common in rural deployment. Furthermore, existing agricultural decision-support features — crop selection, sell-timing, pest and disease response, weather risk, livestock health — are commonly generated as generic, regionally-averaged content rather than from the specific farm, crop, and history data a platform already holds for a given farmer, which reduces their practical value and the farmer's trust in the guidance given.

## OBJECT OF THE INVENTION

It is an object of the present invention to ameliorate these disadvantages, and to provide an agricultural management system in which a single application and a single underlying data model serve the farmer directly as an operational tool and simultaneously serve the agricultural expert, extension officer, project manager, and organizational leadership roles that must act on the same data — such that a farmer's own recorded activity becomes, without a separate export or data-entry step, both visible to the relevant supervisory or advisory role and the direct input to a farm-specific advisory output returned to that same farmer.

## SUMMARY OF THE INVENTION

According to the present invention there is provided an agricultural management system (100) comprising a client application layer (102) deployable across a plurality of device types from a single set of route and component definitions, a role resolution and access control layer (110) operable to bind an authenticated identity (112) to a role attribute (114) selected from a plurality of predetermined agricultural roles, a shared operational data store (130) accessible to the client application layer (102) in dependence on the role attribute (114), and an agricultural intelligence layer (140) operable to generate an advisory output from a record held within the shared operational data store (130), wherein the role resolution and access control layer (110) is configured to render the advisory output visible to a first role attribute (114) associated with the record and to at least a second, different role attribute (114) having a supervisory or analytical association with the record, without requiring export or duplication of the record between separate systems.

Preferably the client application layer (102) comprises a web application instance (104), a mobile-web application instance (106), and a native mobile application instance (108), each generated from the same route and component definitions.

Preferably the plurality of predetermined agricultural roles comprises a farmer role, an agricultural expert role, an extension officer role, a project manager role, and an organizational leadership role.

Preferably the shared operational data store (130) comprises at least one farm record (132) associated with the first role attribute, the farm record comprising a location attribute, a soil-type attribute, and a size attribute.

Preferably the shared operational data store (130) further comprises a crop record (134) associated with the farm record (132), and a market and weather observation record (136) associated with the location attribute of the farm record (132).

Preferably the agricultural intelligence layer (140) comprises a recommendation engine (142) operable to generate a sell-timing recommendation from the crop record (134) and the market and weather observation record (136).

Optionally the agricultural intelligence layer (140) further comprises a market forecasting module (144) and a weather risk module (146).

Optionally the agricultural intelligence layer (140) further comprises an image classification module (148) operable to receive a captured image and the crop record (134) associated with a farm record (132), and to generate a diagnostic finding associated with that farm record.

Optionally the shared operational data store (130) further comprises a livestock record associated with a farm record (132), and the agricultural intelligence layer (140) further comprises a livestock module (150) operable to generate an advisory output from a health-event attribute of the livestock record.

Optionally each farm record (132) further comprises a geospatial attribute, and the system (100) further comprises a mapping module (152) operable to render a plurality of farm records as a geospatially-arranged view scoped by the role resolution and access control layer (110).

Optionally the system (100) further comprises a project coordination module (154) operable to associate a task record with one or more farm records (132) and with a user record having a project manager, extension officer, or organizational leadership role attribute.

Optionally the system (100) further comprises a notification channel (160) operable to deliver the advisory output to a client application instance associated with the first role attribute.

## BRIEF DESCRIPTION OF THE DRAWINGS

Figure 1 is a schematic block diagram of the agricultural management system (100) according to a preferred embodiment of the invention.

Figure 2 is a schematic diagram illustrating the flow of data through the system of Figure 1 in use.

## DETAILED DESCRIPTION OF THE INVENTION

The system (100) shown in Figure 1 comprises a client application layer (102) and a backend comprising a role resolution and access control layer (110), a shared operational data store (130), and an agricultural intelligence layer (140).

The client application layer (102) is generated from a single set of route and component definitions and is deployable as a web application instance (104), a mobile-web application instance (106), and a native mobile application instance (108), the native instance being generated by packaging the same component definitions within a native application shell. Each instance presents a navigation structure and a set of accessible modules determined at runtime by the access control layer (110), rather than by a separate build or codebase per instance or per role.

The access control layer (110) binds an authenticated identity (112), verified by a third-party identity provider, to a user record within the shared operational data store (130), the user record carrying a role attribute (114). The role attribute is selected from a predetermined set of roles associated with agricultural operations, including at least a farmer role, an agricultural expert role, an extension officer role, a project manager role, and an organizational leadership role. The access control layer evaluates the role attribute against a permitted-role set associated with each requested resource of a backend API layer (120), by way of a role-gated route dependency (122), and denies the request where the role attribute is not a member of the permitted-role set.

The shared operational data store (130) is a single schema accessible, subject to the access control layer (110), by every role attribute. It comprises a farm record (132) associated with a user record having a farmer role, the farm record comprising a location attribute, a soil-type attribute, and a size attribute; a crop record (134) associated with a farm record; a market and weather observation record (136) associated with a location attribute; and an alert record (138) associated with a user record.

The agricultural intelligence layer (140) comprises one or more advisory-generating modules operable to read a farm record, an associated crop record, and an associated market and weather observation record, and to generate an advisory output written to an alert record associated with the farmer role of that farm record. In a preferred embodiment, the agricultural intelligence layer comprises a recommendation engine (142) operable to generate a sell-timing recommendation, and a market forecasting module (144) operable to generate a price forecast for a crop record, each scoped to a farm record and its associated location attribute. In a further embodiment, the agricultural intelligence layer comprises a weather risk module (146) operable to generate a risk score from a weather observation record associated with a farm record. In an alternative embodiment, the agricultural intelligence layer further comprises an image classification module (148), operable to receive a captured image and the crop record and location attribute of an associated farm record, and to generate a diagnostic finding written to an alert record associated with that farm record. In a still further embodiment, the shared operational data store further comprises a livestock record associated with a farm record, and the agricultural intelligence layer comprises a livestock module (150) operable to generate an alert record from a health-event attribute of the livestock record. In a yet further embodiment, each farm record comprises a geospatial attribute, and the system comprises a mapping module (152) operable to render a plurality of farm records as a geospatially-arranged view, the plurality being determined by the access control layer according to the role attribute of the requesting identity, such that a farmer role is presented its own farm record and an extension officer, project manager, or organizational leadership role is presented an aggregated view of the farm records within its assigned scope, from the same underlying records. In a further embodiment, the system comprises a project coordination module (154) operable to associate a task record with one or more farm records and with a user record having a project manager, extension officer, or organizational leadership role.

An advisory output or alert record generated by the agricultural intelligence layer is delivered by a notification channel (160) to the client application instance associated with the role attribute to which the alert record is addressed, and is simultaneously visible, subject to the access control layer, to any other role attribute having a supervisory or analytical association with the farm record from which it was generated, without requiring the alert record or its underlying farm record to be exported to or duplicated within a separate system.

Turning to Figure 2: in use, a user authenticates (200) to obtain an authenticated identity, which the access control layer binds to a role attribute. Where the role attribute is a farmer role, the user creates (202) a farm record and one or more crop records via a client application instance. Market and weather observation records accumulate (204) in the shared operational data store, associated with the location attribute of the farm record. The agricultural intelligence layer generates (206) an advisory output from the farm record, its associated crop records, and the accumulated observation records, and writes the advisory output to an alert record. The alert record is delivered (208) to the client application instance of the farmer role by the notification channel and is, in the same step, rendered visible to any role attribute having a supervisory or analytical association with the farm record, so that an agricultural expert, extension officer, project manager, or organizational leadership role authenticating against the system observes the same farm record and the same advisory output without a separate data-transfer step.

## CLAIMS

1. An agricultural management system (100) comprising a client application layer (102) deployable across a plurality of device types from a single set of route and component definitions, a role resolution and access control layer (110) operable to bind an authenticated identity (112) to a role attribute (114) selected from a plurality of predetermined agricultural roles, a shared operational data store (130) accessible to the client application layer (102) in dependence on the role attribute (114), and an agricultural intelligence layer (140) operable to generate an advisory output from a record held within the shared operational data store (130), wherein the role resolution and access control layer (110) is configured to render the advisory output visible to a first role attribute (114) associated with the record and to at least a second, different role attribute (114) having a supervisory or analytical association with the record, without requiring export or duplication of the record between separate systems.

2. A system as claimed in Claim 1 wherein the client application layer (102) comprises a web application instance (104), a mobile-web application instance (106), and a native mobile application instance (108) generated from the same route and component definitions.

3. A system as claimed in Claim 1 or 2 wherein the plurality of predetermined agricultural roles comprises a farmer role, an agricultural expert role, an extension officer role, a project manager role, and an organizational leadership role.

4. A system as claimed in any one of the preceding claims wherein the shared operational data store (130) comprises at least one farm record (132) associated with the first role attribute, the farm record comprising a location attribute, a soil-type attribute, and a size attribute.

5. A system as claimed in Claim 4 wherein the shared operational data store (130) further comprises a crop record (134) associated with the farm record (132), and a market and weather observation record (136) associated with the location attribute of the farm record (132).

6. A system as claimed in Claim 5 wherein the agricultural intelligence layer (140) comprises a recommendation engine (142) operable to generate a sell-timing recommendation from the crop record (134) and the market and weather observation record (136) associated with the farm record (132).

7. A system as claimed in Claim 5 or 6 wherein the agricultural intelligence layer (140) further comprises a market forecasting module (144) operable to generate a price forecast for the crop record (134), and a weather risk module (146) operable to generate a risk score from the market and weather observation record (136).

8. A system as claimed in any one of Claims 4 to 7 wherein the agricultural intelligence layer (140) further comprises an image classification module (148) operable to receive a captured image and the crop record (134) associated with the farm record (132), and to generate a diagnostic finding associated with the farm record (132).

9. A system as claimed in any one of Claims 4 to 8 wherein the shared operational data store (130) further comprises a livestock record associated with the farm record (132), and the agricultural intelligence layer (140) further comprises a livestock module (150) operable to generate an advisory output from a health-event attribute of the livestock record.

10. A system as claimed in any one of Claims 4 to 9 wherein the farm record (132) further comprises a geospatial attribute, and the system (100) further comprises a mapping module (152) operable to render a plurality of farm records (132) as a geospatially-arranged view, the plurality being determined by the role resolution and access control layer (110) in dependence on the role attribute (114) of a requesting identity (112).

11. A system as claimed in any one of the preceding claims further comprising a project coordination module (154) operable to associate a task record with one or more farm records (132) and with a user record having a project manager, extension officer, or organizational leadership role attribute.

12. A system as claimed in any one of the preceding claims further comprising a notification channel (160) operable to deliver the advisory output to a client application instance (104, 106, 108) associated with the first role attribute.

13. A computer-implemented method of operating an agricultural management system (100), comprising: binding an authenticated identity (112) to a role attribute (114) selected from a plurality of predetermined agricultural roles; receiving, from a client application instance (104, 106, 108) associated with a first role attribute, a farm record (132) and an associated crop record (134) for storage in a shared operational data store (130); generating, by an agricultural intelligence layer (140), an advisory output from the farm record (132), the crop record (134), and a market or weather observation record (136) associated with the farm record (132); and rendering the advisory output visible to the first role attribute and to at least a second, different role attribute having a supervisory or analytical association with the farm record (132), without exporting or duplicating the farm record (132) between separate systems.

14. A method as claimed in Claim 13 further comprising generating the advisory output from a captured image associated with the farm record (132) by an image classification module (148).

15. A method as claimed in Claim 13 or 14 further comprising delivering the advisory output to the client application instance associated with the first role attribute via a notification channel (160), substantially concurrently with rendering the advisory output visible to the second role attribute.

16. A system substantially as hereinbefore described with reference to, and as shown in, the accompanying drawings.

17. A method substantially as hereinbefore described with reference to, and as shown in, the accompanying drawings.

## ABSTRACT

An agricultural management system (100) comprising a client application layer (102) deployable across a plurality of device types from a single set of route and component definitions, a role resolution and access control layer (110) binding an authenticated identity (112) to a role attribute (114) selected from a plurality of predetermined agricultural roles, and a shared operational data store (130) accessible in dependence on the role attribute (114). An agricultural intelligence layer (140) generates an advisory output from a farm record (132) held within the data store (130), the role resolution and access control layer (110) rendering the advisory output visible both to the farmer role associated with the farm record and to an agricultural expert, extension officer, project manager, or organizational leadership role having a supervisory or analytical association with the farm record, without export or duplication of the record between separate systems.

---

## DRAFTING NOTES (not part of the specification — for internal use only)

**Implementation status per reference numeral**, so claims can be pitched at the right breadth and counsel knows what's reduced to practice versus prophetic:

- **Reduced to practice today:** client application layer (102/104/106/108) — implemented; access control layer (110/112/114/120/122) — implemented (Firebase token verification, `require_roles` dependency, single-schema PostgreSQL model); shared operational data store (130/132/134/136/138) — implemented for farms/crops/market prices/weather/alerts.
- **Architected, not yet functional:** recommendation engine (142), market forecasting module (144), weather risk module (146) — endpoints and schemas exist; inference logic is a stub returning placeholder values today.
- **Not implemented, prophetic embodiment only:** image classification module (148), livestock module (150), mapping module (152), project coordination module (154). The geospatial *attribute* on the farm record (latitude/longitude) already exists in the schema; the mapping module itself does not.
- **Role vocabulary gap:** the role attribute (114) currently implemented in code (`farmer`, `field_officer`, `researcher`, `supervisor`, `analyst`, `admin`, `viewer`) is shaped around the excluded research/FMNR product. FaidaFarm's own role set (farmer, agricultural expert, extension officer, project manager, organizational leadership) as described in Claim 3 does not yet exist in the codebase — worth reconciling in code before/alongside filing.

**Ordinary features deliberately excluded from claims** (present in the product, individually conventional, would invite easy prior-art rejection if claimed): displaying a market price list; displaying a buyer directory; displaying a weather snapshot; a static tools/services directory; a financing placeholder page; standard account settings screens; a bare login/signup/OTP/reset flow (novelty sits in what consumes the identity — the role layer — not the auth flow itself); generic CRUD persistence of a record in isolation; packaging a web app for Android in isolation (only claimed as part of the single-codebase, role-adaptive multi-surface behavior in Claim 2).

**Open items before filing:** (1) resolve the role-vocabulary gap above; (2) the more technical detail available now for modules 148–154, the stronger and harder to design around Claims 8–11 become; (3) confirm with counsel whether to file now (architecture claims strong, intelligence-layer claims thinner on enablement) or wait until at least one of modules 142/144/146 is reduced to practice.
