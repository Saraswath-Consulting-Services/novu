import { Accordion, Group, SimpleGrid, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import { DigestTypeEnum, DigestUnitEnum } from '@novu/shared';

import { When } from '../../../components/utils/When';
import { colors, Input, SegmentedControl, Select } from '../../../design-system';
import { inputStyles } from '../../../design-system/config/inputs.styles';
import { WeekDaySelect } from './digest/WeekDaySelect';
import { Bell, Digest, Timer } from '../../../design-system/icons';
import { TypeSegmented } from './digest/TypeSegment';
import { IntervalSelect } from './digest/IntervalSelect';
import { BackOffFields } from './digest/BackOffFields';
import { WillBeSentHeader } from './digest/WillBeSentHeader';
import { ScheduleMonthlyFields } from './digest/ScheduleMonthlyFields';

const convertUnitToLabel = (unit: DigestUnitEnum) => {
  switch (unit) {
    case DigestUnitEnum.SECONDS:
      return 'second';
    case DigestUnitEnum.MINUTES:
      return 'minute';
    case DigestUnitEnum.HOURS:
      return 'hour';
    case DigestUnitEnum.DAYS:
      return 'day';
    case DigestUnitEnum.WEEKS:
      return 'week';
    case DigestUnitEnum.MONTHS:
      return 'month';
  }
};

export const DigestMetadata = ({ control, index, readonly }) => {
  const {
    formState: { errors, isSubmitted },
    watch,
    trigger,
  } = useFormContext();

  const { colorScheme } = useMantineColorScheme();

  const type = watch(`steps.${index}.metadata.type`);
  const unit = watch(`steps.${index}.metadata.unit`);
  const digestKey = watch(`steps.${index}.metadata.digestKey`);
  const showErrors = isSubmitted && errors?.steps;
  const isEnterprise = process.env.REACT_APP_DOCKER_HOSTED_ENV !== 'true';

  return (
    <div data-test-id="digest-step-settings-interval">
      <Accordion>
        <Accordion.Item value="events-selection" data-test-id="digest-events-selection-options">
          <Accordion.Control>
            <Group>
              <Bell color={colors.B60} />
              <div>
                <div>
                  <b
                    style={{
                      color: colorScheme === 'dark' ? colors.B80 : colors.B40,
                    }}
                  >
                    All events
                  </b>
                </div>
                <div>since previous digest</div>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Select mt={-5} mb={-5} data={[{ value: 'all', label: 'All events' }]} value={'all'} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="group-by" data-test-id="digest-group-by-options">
          <Accordion.Control>
            <Group>
              <div style={{ width: 26 }}>
                <Digest color={colors.B60} />
              </div>
              <div>
                <div>
                  <b>Aggregated by Subscriber_ID</b>
                </div>
                <When truthy={!digestKey}>
                  <div>Add grouping...</div>
                </When>
                <When truthy={digestKey}>
                  <div>
                    And by{' '}
                    <b
                      style={{
                        color: colorScheme === 'dark' ? colors.B80 : colors.B40,
                      }}
                    >
                      {digestKey}
                    </b>
                  </div>
                </When>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Controller
              control={control}
              name={`steps.${index}.metadata.digestKey`}
              defaultValue=""
              render={({ field, fieldState }) => {
                return (
                  <Input
                    {...field}
                    mt={-5}
                    mb={-5}
                    value={field.value || ''}
                    placeholder="Post_ID, Attribute_ID, etc."
                    error={fieldState.error?.message}
                    type="text"
                    data-test-id="batch-key"
                    disabled={readonly}
                  />
                );
              }}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="send" data-test-id="digest-send-options">
          <Accordion.Control>
            <Group>
              <Timer width="30" height="30" color={colors.B60} />
              <div>
                <div>
                  <b>Will be sent</b>
                </div>
                <div>
                  <WillBeSentHeader index={index} />
                </div>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <When truthy={isEnterprise}>
              <Controller
                control={control}
                defaultValue={DigestTypeEnum.REGULAR}
                name={`steps.${index}.metadata.type`}
                render={({ field }) => {
                  return (
                    <TypeSegmented
                      {...field}
                      sx={{
                        maxWidth: '100% !important',
                        marginBottom: -14,
                      }}
                      fullWidth
                      disabled={readonly}
                      data={[
                        { value: DigestTypeEnum.REGULAR, label: 'Event' },
                        { value: DigestTypeEnum.TIMED, label: 'Schedule' },
                      ]}
                      onChange={async (segmentValue) => {
                        field.onChange(segmentValue);
                        await trigger(`steps.${index}.metadata`);
                      }}
                      data-test-id="digest-type"
                    />
                  );
                }}
              />
            </When>
            <div
              style={{
                background: colorScheme === 'dark' ? colors.B20 : colors.BGLight,
                padding: 16,
                borderRadius: 8,
              }}
            >
              <When truthy={type === DigestTypeEnum.TIMED}>
                <Controller
                  control={control}
                  defaultValue={DigestUnitEnum.DAYS}
                  name={`steps.${index}.metadata.unit`}
                  render={({ field }) => {
                    return (
                      <SegmentedControl
                        {...field}
                        size="sm"
                        sx={{
                          maxWidth: '100% !important',
                        }}
                        fullWidth
                        disabled={readonly}
                        data={[
                          { value: DigestUnitEnum.MINUTES, label: 'Min' },
                          { value: DigestUnitEnum.HOURS, label: 'Hour' },
                          { value: DigestUnitEnum.DAYS, label: 'Daily' },
                          { value: DigestUnitEnum.WEEKS, label: 'Weekly' },
                          { value: DigestUnitEnum.MONTHS, label: 'Monthly' },
                        ]}
                        onChange={async (segmentValue) => {
                          field.onChange(segmentValue);
                          await trigger(`steps.${index}.metadata`);
                        }}
                        data-test-id="digest-type"
                      />
                    );
                  }}
                />
                <Group spacing={8} sx={{ color: colors.B60 }}>
                  <span>Every</span>
                  <Controller
                    control={control}
                    name={`steps.${index}.metadata.amount`}
                    defaultValue=""
                    render={({ field, fieldState }) => {
                      return (
                        <Input
                          {...field}
                          value={field.value || '1'}
                          error={showErrors && fieldState.error?.message}
                          min={1}
                          max={100}
                          type="number"
                          data-test-id="time-amount"
                          placeholder="0"
                          disabled={readonly}
                          styles={(theme) => ({
                            ...inputStyles(theme),
                            input: {
                              textAlign: 'center',
                              ...inputStyles(theme).input,
                            },
                          })}
                        />
                      );
                    }}
                  />
                  <span>{convertUnitToLabel(unit)}(s)</span>
                  <When truthy={[DigestUnitEnum.DAYS, DigestUnitEnum.WEEKS, DigestUnitEnum.MONTHS].includes(unit)}>
                    <span>at</span>
                    <Controller
                      control={control}
                      name={`steps.${index}.metadata.timed.atTime`}
                      shouldUnregister
                      defaultValue=""
                      render={({ field, fieldState }) => {
                        return (
                          <Input
                            {...field}
                            value={field.value || ''}
                            error={showErrors && fieldState.error?.message}
                            type="time"
                            data-test-id="time-at"
                            placeholder="0"
                            disabled={readonly}
                            styles={(theme) => ({
                              ...inputStyles(theme),
                              input: {
                                textAlign: 'center',
                                ...inputStyles(theme).input,
                              },
                            })}
                          />
                        );
                      }}
                    />
                  </When>
                  <When truthy={[DigestUnitEnum.WEEKS, DigestUnitEnum.MONTHS].includes(unit)}>
                    <span>on:</span>
                  </When>
                </Group>
                <When truthy={unit === DigestUnitEnum.WEEKS}>
                  <Controller
                    control={control}
                    name={`steps.${index}.metadata.timed.weekDays`}
                    defaultValue=""
                    shouldUnregister
                    render={({ field }) => {
                      return (
                        <WeekDaySelect
                          value={field.value}
                          disabled={readonly}
                          onChange={async (value) => {
                            field.onChange(value);
                            await trigger(`steps.${index}.metadata`);
                          }}
                        />
                      );
                    }}
                  />
                </When>
                <ScheduleMonthlyFields readonly={readonly} index={index} control={control} />
              </When>
              <When truthy={type !== DigestTypeEnum.TIMED}>
                <Group spacing={8} sx={{ color: colors.B60 }}>
                  <span>digest events for</span>
                  <Controller
                    control={control}
                    name={`steps.${index}.metadata.amount`}
                    defaultValue=""
                    render={({ field, fieldState }) => {
                      return (
                        <Input
                          {...field}
                          value={field.value || ''}
                          error={showErrors && fieldState.error?.message}
                          min={0}
                          max={100}
                          type="number"
                          data-test-id="time-amount"
                          placeholder="0"
                          disabled={readonly}
                          styles={(theme) => ({
                            ...inputStyles(theme),
                            input: {
                              textAlign: 'center',
                              ...inputStyles(theme).input,
                              minHeight: '30px',
                              margin: 0,
                              height: 30,
                              lineHeight: '32px',
                            },
                          })}
                        />
                      );
                    }}
                  />
                  <div
                    style={{
                      width: '90px',
                      height: 30,
                    }}
                  >
                    <IntervalSelect
                      readonly={readonly}
                      control={control}
                      name={`steps.${index}.metadata.unit`}
                      showErrors={showErrors}
                    />
                  </div>
                  <span>before send</span>
                </Group>
                <BackOffFields index={index} control={control} readonly={readonly} />
              </When>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
