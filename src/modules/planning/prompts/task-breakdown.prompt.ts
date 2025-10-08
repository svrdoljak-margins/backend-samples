import { TaskBreakdownRequestDto } from '../dto/task-breakdown-request.dto';

const SEPARATOR = '\n---\n';

/**
 * Builds the prompt sent to the LLM for generating task breakdowns.
 * @param request - Planning request payload.
 * @returns Prompt string for the LLM.
 */
export const buildTaskBreakdownPrompt = (
  request: TaskBreakdownRequestDto,
): string => {
  const baseLines = [
    'You are an experienced project planner. Break the primary task into clear, actionable subtasks.',
    'Each subtask should be outcome-based, ideally completable within a few hours, and reference the tools or skills needed when relevant.',
    'Return the subtasks as a numbered list without additional commentary, ensuring they are ordered logically and do not overlap.',
    SEPARATOR,
    `Primary task: ${request.summary.trim()}`,
  ];

  const optionalSections = [
    formatTextSection('Context', request.context),
    formatListSection('Constraints', request.constraints, '; '),
    formatListSection('Focus areas', request.categories, ', '),
    formatListSection(
      'Avoid duplicating these subtasks',
      request.existingSubtasks,
      ' | ',
    ),
    request.estimatedEffortHours
      ? `Estimated effort: ${request.estimatedEffortHours} hours`
      : null,
    request.dueDate ? `Deadline: ${request.dueDate}` : null,
  ].filter((section): section is string => Boolean(section));

  const closingLine = `Aim for ${request.preferredSubtaskCount ?? 8} high-quality subtasks that collectively achieve the primary goal.`;

  return [...baseLines, ...optionalSections, closingLine].join('\n');
};

/**
 * Formats a single-line text section for the prompt.
 * @param label - Section label.
 * @param value - Optional text value.
 * @returns Formatted section or null when empty.
 */
const formatTextSection = (
  label: string,
  value?: string | null,
): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? `${label}: ${trimmed}` : null;
};

/**
 * Formats a list of values into a single prompt section.
 * @param label - Section label.
 * @param values - Values to include.
 * @param separator - Separator between values.
 * @returns Formatted section or null when empty.
 */
const formatListSection = (
  label: string,
  values?: string[],
  separator = ', ',
): string | null => {
  if (!values?.length) {
    return null;
  }

  const cleaned = values.map((item) => item.trim()).filter(Boolean);
  return cleaned.length ? `${label}: ${cleaned.join(separator)}` : null;
};
