import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    Input,
} from '@angular/core';
import {SafeResourceUrl} from '@angular/platform-browser';
import {tuiDefaultProp, tuiRequiredSetter} from '@taiga-ui/cdk';
import {tuiSizeBigger} from '@taiga-ui/core';
import {tuiStringHashToHsl} from '@taiga-ui/kit/utils/format';

import {TUI_AVATAR_OPTIONS, TuiAvatarOptions} from './avatar-options';

@Component({
    selector: 'tui-avatar',
    templateUrl: './avatar.template.html',
    styleUrls: ['./avatar.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiAvatarComponent {
    @Input()
    @HostBinding('attr.data-size')
    @tuiDefaultProp()
    size = this.options.size;

    @Input('avatarUrl')
    @tuiRequiredSetter()
    set avatarUrlSetter(avatarUrl: SafeResourceUrl | string | null) {
        this.avatarUrl = avatarUrl;
        this.isUrlValid = !!avatarUrl && !this.iconAvatar;
    }

    @Input()
    @tuiDefaultProp()
    text = '';

    @Input()
    @tuiDefaultProp()
    autoColor: boolean = this.options.autoColor;

    @Input()
    @HostBinding('class._rounded')
    @tuiDefaultProp()
    rounded: boolean = this.options.rounded;

    avatarUrl: SafeResourceUrl | string | null = null;

    isUrlValid = false;

    constructor(@Inject(TUI_AVATAR_OPTIONS) private readonly options: TuiAvatarOptions) {}

    @HostBinding('style.background')
    get bgColor(): string {
        return this.autoColor ? tuiStringHashToHsl(this.text) : '';
    }

    @HostBinding('class._has-avatar')
    get hasAvatar(): boolean {
        return this.avatarUrl !== null && this.isUrlValid;
    }

    get iconAvatar(): boolean {
        return (
            typeof this.avatarUrl === 'string' && !!this.avatarUrl?.startsWith('tuiIcon')
        );
    }

    get computedText(): string {
        if (this.hasAvatar || this.iconAvatar || this.text === '') {
            return '';
        }

        const words = this.text.split(' ');

        return words.length > 1 && tuiSizeBigger(this.size)
            ? words[0].slice(0, 1) + words[1].slice(0, 1)
            : words[0].slice(0, 1);
    }

    get stringAvatar(): string {
        return this.iconAvatar ? String(this.avatarUrl) : '';
    }

    onError(): void {
        this.isUrlValid = false;
    }
}
