/*
 DIRECTSD-source.js - ESP3D WebUI Target file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
import { h } from 'preact'
import { canProcessFile } from '../../helpers'
import { sortedFilesList, formatStatus } from '../../../components/Helpers'
import { useSettingsContextFn } from '../../../contexts'

const capabilities = {
    Process: (path, filename) => {
        if (
            (useSettingsContextFn.getValue('Streaming') == 'Enabled' &&
                useSettingsContextFn.getValue('SDConnection') == 'direct') ||
            useSettingsContextFn.getValue('SDConnection') == 'shared'
        )
            return canProcessFile(filename)
        return false
    },
    UseFilters: () => true,
    IsFlatFS: () => false,
    Upload: () => {
        return true
    },
    Mount: () => {
        return false
    },
    UploadMultiple: () => {
        return true
    },
    Download: () => {
        return true
    },
    DeleteFile: () => {
        return true
    },
    DeleteDir: () => {
        return true
    },
    CreateDir: () => {
        return true
    },
}

const commands = {
    list: (path, filename) => {
        return {
            type: 'url',
            url: 'sdfiles',
            args: { path, action: 'list' },
        }
    },
    upload: (path, filename) => {
        return {
            type: 'url',
            url: 'sdfiles',
            args: { path },
        }
    },
    formatResult: (resultTxT) => {
        const res = JSON.parse(resultTxT)
        res.files = sortedFilesList(res.files)
        res.status = formatStatus(res.status)
        return res
    },

    deletedir: (path, filename) => {
        return {
            type: 'url',
            url: 'sdfiles',
            args: { path, action: 'deletedir', filename },
        }
    },
    delete: (path, filename) => {
        return {
            type: 'url',
            url: 'sdfiles',
            args: { path, action: 'delete', filename },
        }
    },
    needFormatFileName: (path, filename) => {
        return {
            name: filename.replaceAll(' ', '_'),
        }
    },
    createdir: (path, filename) => {
        return {
            type: 'url',
            url: 'sdfiles',
            args: {
                path,
                action: 'createdir',
                filename: filename.replaceAll(' ', '_'),
            },
        }
    },
    download: (path, filename) => {
        return {
            type: 'url',
            url: '/sd' + path + (path.endsWith('/') ? '' : '/') + filename,
            args: {},
        }
    },
    play: (path, filename) => {
        if (
            useSettingsContextFn.getValue('Streaming') == 'Enabled' &&
            useSettingsContextFn.getValue('SDConnection') == 'direct'
        ) {
            let fullpath =
                '/sd' + path + (path.endsWith('/') ? '' : '/') + filename
            return {
                type: 'cmd',
                cmd: '[ESP700]stream=' + fullpath.replaceAll(' ', ' '),
            }
        } else {
            return {
                type: 'cmd',
                cmd:
                    'M23 ' +
                    path +
                    (path == '/' ? '' : '/') +
                    filename +
                    '\nM24',
            }
        }
    },
}

const DIRECTSD = { capabilities, commands }

export { DIRECTSD }
