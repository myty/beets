import { EditableParagraph } from "components/editable-paragraph";
import { SequencerDialog } from "components/sequencer/sequencer-dialog";
import {
    Card,
    DeleteIcon,
    HeatGridIcon,
    IconButton,
    majorScale,
    minorScale,
    Pane,
    PlusIcon,
    PropertiesIcon,
    PropertyIcon,
    Spinner,
    Tooltip,
    VolumeOffIcon,
    VolumeUpIcon,
} from "evergreen-ui";
import { FileRecord } from "models/file-record";
import React, { useCallback, useEffect, useState } from "react";
import { useListFiles } from "utils/hooks/domain/files/use-list-files";
import { useBoolean } from "utils/hooks/use-boolean";
import { List } from "immutable";
import { initializeList } from "utils/core-utils";
import { Track as ReactronicaTrack, Instrument } from "reactronica";
import { TrackRecord } from "models/track-record";
import { useWorkstationState } from "utils/hooks/use-workstation-state";
import { TrackSection } from "components/track-section";
import { useTheme } from "utils/hooks/use-theme";

interface TrackProps {
    track: TrackRecord;
}

const iconMarginRight = minorScale(2);

const Track: React.FC<TrackProps> = (props: TrackProps) => {
    const { track } = props;
    const { id, name, mute, solo } = track;
    const { updateTrack, removeTrack } = useWorkstationState();
    const {
        value: sequencerDialogOpen,
        setTrue: handleOpenSequencerDialog,
        setFalse: handleCloseSequencerDialog,
    } = useBoolean(false);
    const { resultObject: files } = useListFiles();
    const [sequencerValue, setSequencerValue] = useState<
        List<List<FileRecord>>
    >(initializeList(16, List()));
    const {
        value: loadingSamples,
        setTrue: setLoadingSamplesTrue,
        setFalse: setLoadingSamplesFalse,
    } = useBoolean(false);

    const theme = useTheme();
    const sections = track.getSections();
    const samples = sequencerValue.flatten().toList() as List<FileRecord>;

    const setName = useCallback(
        (value: string) => updateTrack(id, { name: value }),
        [id, updateTrack]
    );

    const toggleMute = useCallback(
        () => updateTrack(id, { mute: !mute }),
        [id, mute, updateTrack]
    );

    const toggleSolo = useCallback(
        () => updateTrack(id, { solo: !solo }),
        [id, solo, updateTrack]
    );

    const remove = useCallback(() => removeTrack(track), [removeTrack, track]);

    useEffect(() => {
        if (sequencerValue.flatten().isEmpty()) {
            return;
        }
        setLoadingSamplesTrue();
    }, [sequencerValue, setLoadingSamplesTrue]);

    return (
        <Pane display="flex" flexDirection="row" alignItems="center">
            <Card
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                background={theme.colors.gray200}
                width={majorScale(21)}
                marginY={majorScale(1)}
                padding={majorScale(1)}>
                <EditableParagraph onChange={setName} value={name} />
                <Pane display="flex" flexDirection="row">
                    <Tooltip content="Mute Track">
                        <IconButton
                            icon={mute ? VolumeOffIcon : VolumeUpIcon}
                            marginRight={iconMarginRight}
                            onClick={toggleMute}
                        />
                    </Tooltip>
                    <Tooltip content="Solo Track">
                        <IconButton
                            icon={solo ? PropertyIcon : PropertiesIcon}
                            marginRight={iconMarginRight}
                            onClick={toggleSolo}
                        />
                    </Tooltip>
                    <Tooltip content="Sequencer">
                        <IconButton
                            icon={loadingSamples ? Spinner : HeatGridIcon}
                            marginRight={iconMarginRight}
                            onClick={handleOpenSequencerDialog}
                        />
                    </Tooltip>
                    <Tooltip content="Remove Track">
                        <IconButton
                            icon={DeleteIcon}
                            intent="danger"
                            marginRight={iconMarginRight}
                            onClick={remove}
                        />
                    </Tooltip>
                </Pane>
                {sequencerDialogOpen && files != null && (
                    <SequencerDialog
                        files={files}
                        onChange={setSequencerValue}
                        onClose={handleCloseSequencerDialog}
                        trackId={id}
                        value={sequencerValue}
                    />
                )}
                <ReactronicaTrack
                    mute={mute}
                    solo={solo}
                    steps={FileRecord.toStepTypes(sequencerValue)}>
                    <Instrument
                        onLoad={setLoadingSamplesFalse}
                        samples={FileRecord.toMidiNoteMap(samples)}
                        type="sampler"
                    />
                </ReactronicaTrack>
            </Card>
            {sections.map((section) => (
                <TrackSection section={section} />
            ))}
            <Tooltip content="Add Section">
                <IconButton icon={PlusIcon} onClick={toggleMute} />
            </Tooltip>
        </Pane>
    );
};

export { Track };
export type { TrackProps };
