import { PianoKey } from "components/piano-roll/piano-key";
import { PianoStep } from "components/piano-roll/piano-step";
import { MidiNotes } from "constants/midi-notes";
import { Pane } from "evergreen-ui";
import { List } from "immutable";
import _ from "lodash";
import { FileRecord } from "models/file-record";
import { TrackSectionRecord } from "models/track-section-record";
import { TrackSectionStepRecord } from "models/track-section-step-record";
import React, { useCallback, useMemo } from "react";
import { MidiNote } from "@brandongregoryscott/reactronica";
import { useTheme } from "utils/hooks/use-theme";
import { isSelected } from "utils/track-section-step-utils";

interface PianoStepsProps {
    file?: FileRecord;
    indexRange: number;
    isPlaying: boolean;
    onChange: (value: List<TrackSectionStepRecord>) => void;
    playingIndex?: number;
    stepCount: number;
    trackSection: TrackSectionRecord;
    trackSectionSteps: List<TrackSectionStepRecord>;
    viewableIndex: number;
}

const PianoSteps: React.FC<PianoStepsProps> = (props: PianoStepsProps) => {
    const {
        viewableIndex,
        indexRange,
        file,
        isPlaying,
        playingIndex,
        onChange,
        stepCount,
        trackSection,
        trackSectionSteps,
    } = props;

    const { colors } = useTheme();
    const handleClick = useCallback(
        (index: number, note: MidiNote) => {
            if (isSelected(trackSectionSteps, index, note)) {
                onChange(
                    trackSectionSteps.filterNot(
                        (trackSectionStep) =>
                            trackSectionStep.index === index &&
                            trackSectionStep.note === note
                    )
                );

                return;
            }

            onChange(
                trackSectionSteps.push(
                    new TrackSectionStepRecord({
                        file_id: file?.id,
                        index,
                        note,
                        track_section_id: trackSection.id,
                    })
                )
            );
        },
        [file, onChange, trackSection, trackSectionSteps]
    );

    const notes = useMemo(
        () =>
            MidiNotes.slice(
                Math.max(viewableIndex, 0),
                viewableIndex + indexRange
            ),
        [indexRange, viewableIndex]
    );

    const innerContent = useMemo(
        () =>
            notes.map((note, rowIndex) => (
                <Pane
                    backgroundColor={colors.gray300}
                    display="flex"
                    flexDirection="row"
                    flexGrow={1}
                    key={`piano-steps-pane-${note}`}
                    width="min-content">
                    <PianoKey key={`piano-steps-key-${note}`} note={note} />
                    {_.range(0, stepCount).map((index: number) => (
                        <PianoStep
                            index={index}
                            isFirst={rowIndex === 0}
                            isLast={rowIndex === indexRange - 1}
                            isPlaying={isPlaying && index === playingIndex}
                            isSelected={isSelected(
                                trackSectionSteps,
                                index,
                                note
                            )}
                            key={`piano-steps-step-${note}-${index}`}
                            note={note}
                            onClick={handleClick}
                        />
                    ))}
                </Pane>
            )),
        [
            colors.gray300,
            handleClick,
            indexRange,
            isPlaying,
            notes,
            playingIndex,
            stepCount,
            trackSectionSteps,
        ]
    );
    return (
        <Pane
            display="flex"
            flexDirection="column"
            justifyContent="center"
            marginX="auto">
            {innerContent}
        </Pane>
    );
};

export { PianoSteps };
