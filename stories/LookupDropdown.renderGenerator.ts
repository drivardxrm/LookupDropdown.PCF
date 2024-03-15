import {
    ComponentFrameworkMockGenerator,
    EnumPropertyMock,
    LookupPropertyMock,
    ShkoOnline,
    StringPropertyMock,
  } from "@shko.online/componentframework-mock";
  
  import { LookupDropdown as Component } from "../LookupDropdown/index";
  import { IInputs, IOutputs } from "../LookupDropdown/generated/ManifestTypes";
  import { useArgs } from "@storybook/client-api";
  import { ImgBetim, ImgDavid } from "./mock/EntityImages";

export interface StoryArgs {
    customselecttext: string;
    customtext: string;
    dependentlookupfield: ComponentFramework.LookupValue;
    lookupfield: ComponentFramework.LookupValue;
    showOpenRecordButton: boolean;
    showRecordImage: boolean;
  }

export const renderGenerator = () => {
    let container: HTMLDivElement;
    let mockGenerator: ComponentFrameworkMockGenerator<IInputs, IOutputs>;
  
    return function () {
      const [args, updateArgs] = useArgs<StoryArgs>();
      if (!container) {
        container = document.createElement("div");
        mockGenerator = new ComponentFrameworkMockGenerator(
          Component,
          {
            customselecttext: StringPropertyMock,
            customtext: StringPropertyMock,
            dependentlookupfield: LookupPropertyMock,
            lookupfield: LookupPropertyMock,
            showOpenRecordButton: EnumPropertyMock<"false" | "true">,
            showRecordImage: EnumPropertyMock<"false" | "true">,
            sortByTextValue: EnumPropertyMock<"false" | "true">,
          },
          container
        );
  
        mockGenerator.metadata.initMetadata([
          {
            LogicalName: "contact",
            SchemaName: "Contact",
            PrimaryIdAttribute: "contactid",
            PrimaryNameAttribute: "fullname",
            PrimaryImageAttribute: "entityimage",
            ManyToOneRelationships: [],
            OneToManyRelationships: [],
          } as ShkoOnline.EntityMetadata,
        ]);
  
        mockGenerator.context._parameters.lookupfield.security = {
          editable: true,
          readable: true,
          secured: false,
        };
  
        mockGenerator.context.webAPI.retrieveRecord.callsFake(
          (entityType: string, id: string, options?: string) => {
            if (entityType === "savedquery") {
              return new Promise((resolve) =>
                setTimeout(
                  () =>
                    resolve({
                      returnedtypecode: "contact",
                      fetchxml: `<fetch>
                        <entity>
                        </entity>
                      </fetch>`,
                      // eslint-disable-next-line no-undef
                    } as ComponentFramework.WebApi.Entity),
                  100
                )
              );
            }
            return new Promise((_resolve, reject) => {
              setTimeout(() => reject(new Error("invalid")), 100);
            });
          }
        );
  
        mockGenerator.context.webAPI.retrieveMultipleRecords.callsFake(
          (entityType: string, options?: string, maxPageSize?: number) => {
            return new Promise((resolve) => {
              resolve({
                entities: [
                  {
                    contactid: "1",
                    fullname: "Betim Beja",
                    country: "Albania",
                    entityimage: ImgBetim,
                  },
                  {
                    contactid: "2",
                    fullname: "David Rivard",
                    country: "Canada",
                    entityimage: ImgDavid,
                  },
                ],
                nextLink: "",
              });
            });
          }
        );
  
        mockGenerator.onOutputChanged.callsFake(() => {
          const { dependentlookupfield, lookupfield } =
            mockGenerator.control.getOutputs?.() || {};
          updateArgs({
            lookupfield: lookupfield?.[0],
            dependentlookupfield: dependentlookupfield?.[0],
          });
        });
  
        mockGenerator.context._SetCanvasItems({
          lookupfield: args.lookupfield,
          customselecttext: args.customselecttext,
          customtext: args.customtext,
        });
  
        mockGenerator.ExecuteInit();
      }
  
      if (mockGenerator) {
        mockGenerator.context._parameters.customselecttext._SetValue(
          args.customselecttext
        );
        mockGenerator.context._parameters.customtext._SetValue(args.customtext);
        mockGenerator.context._parameters.dependentlookupfield._SetValue(
          args.dependentlookupfield
        );
        mockGenerator.context._parameters.lookupfield._SetValue(args.lookupfield);
        mockGenerator.context._parameters.showOpenRecordButton._SetValue(
          args.showOpenRecordButton ? "true" : "false"
        );
        mockGenerator.context._parameters.showRecordImage._SetValue(
          args.showRecordImage ? "true" : "false"
        );
        mockGenerator.ExecuteUpdateView();
      }
  
      return container;
    };
  };