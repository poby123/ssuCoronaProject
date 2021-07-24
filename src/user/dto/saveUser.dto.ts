import { User } from "../domain/user.entity";

export class UserSaveRequestDto {
    userId: string;
    password: string;
    organization: string;
    username: string;
    nfcId: string;

    constructor(builder: UserSaveRequestDtoBuilder) {
        this.userId = builder._userId;
        this.password = builder._password;
        this.organization = builder._organization;
        this.username = builder._username;
        this.nfcId = builder._nfcId;
    }

    static toEntity(dto: UserSaveRequestDto): User {
        const user = new User();

        user.userId = dto.userId;
        user.password = dto.password;
        user.username = dto.username;
        user.organization = dto.organization;
        user.nfcId = dto.nfcId;
        user.isActive = true;

        return user;
    }
}

export class UserSaveResponseDto {
    userId: string;
    organization: string;
    username: string;
    nfcId: string;

    constructor(userId: string, organization: string, username: string, nfcId: string) {
        this.userId = userId;
        this.organization = organization;
        this.username = username;
        this.nfcId = nfcId;
    }

    static fromEntity(user: User): UserSaveResponseDto {
        const { userId, organization, username, nfcId } = user;
        const responseDto = new UserSaveResponseDto(userId, organization, username, nfcId);
        return responseDto;
    }
}

export class UserSaveRequestDtoBuilder {
    _userId: string;
    _password: string;
    _organization: string;
    _username: string;
    _nfcId: string;

    constructor(userId: string, password: string) {
        this._userId = userId;
        this._password = password;

        this._organization = '';
        this._username = '';
        this._nfcId = '';
    }

    setOrganization(organization: string): UserSaveRequestDtoBuilder {
        this._organization = organization
        return this;
    }

    setUserName(username: string): UserSaveRequestDtoBuilder {
        this._username = username;
        return this;
    }

    setNfcId(nfcId: string): UserSaveRequestDtoBuilder {
        this._nfcId = nfcId;
        return this;
    }

    build(): UserSaveRequestDto {
        return new UserSaveRequestDto(this);
    }
}